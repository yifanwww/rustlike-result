import { Err, fromPromiseableResult } from '@rustresult/result';
import type { Result, ResultAsync } from '@rustresult/result';
import type { DataSource, EntityManager } from 'typeorm';
import type { IsolationLevel } from 'typeorm/driver/types/IsolationLevel.js';

/**
 * Wraps given function execution (and all operations made there) into a transaction.
 * All database operations must be executed using provided entity manager.
 */
export function typeormTransaction<Res, Err>(
    dataSource: DataSource,
    runInTransaction: (entityManager: EntityManager) => Promise<Result<Res, Err>> | ResultAsync<Res, Err>,
): ResultAsync<Res, Err | Error>;

/**
 * Wraps given function execution (and all operations made there) into a transaction.
 * All database operations must be executed using provided entity manager.
 */
export function typeormTransaction<Res, Err>(
    dataSource: DataSource,
    isolationLevel: IsolationLevel,
    runInTransaction: (entityManager: EntityManager) => Promise<Result<Res, Err>> | ResultAsync<Res, Err>,
): ResultAsync<Res, Err | Error>;

export function typeormTransaction<Res, Err>(
    dataSource: DataSource,
    ...params:
        | [(entityManager: EntityManager) => Promise<Result<Res, Err>> | ResultAsync<Res, Err>]
        | [IsolationLevel, (entityManager: EntityManager) => Promise<Result<Res, Err>> | ResultAsync<Res, Err>]
): ResultAsync<Res, Err | Error> {
    const isolation = typeof params[0] === 'string' ? params[0] : undefined;
    const runInTransaction = typeof params[0] === 'function' ? params[0] : params[1];

    const queryRunner = dataSource.createQueryRunner();

    const innerTransaction = async (): Promise<Result<Res, Err | Error>> => {
        await queryRunner.connect();
        await queryRunner.startTransaction(isolation);
        try {
            const result = await runInTransaction(queryRunner.manager);
            if (result.isOk()) {
                await queryRunner.commitTransaction();
            } else {
                try {
                    await queryRunner.rollbackTransaction();
                } catch {
                    // ignore rollback errors
                }
            }
            return result;
        } catch (err) {
            try {
                await queryRunner.rollbackTransaction();
            } catch {
                // ignore rollback errors
            }
            return err instanceof Error ? Err(err) : Err(new Error(String(err)));
        } finally {
            await queryRunner.release();
        }
    };

    return fromPromiseableResult(innerTransaction());
}
