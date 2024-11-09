import { describe, expect, it, jest } from '@jest/globals';
import { Err, ErrAsync, Ok, OkAsync } from '@result/result';
import type { DataSource, EntityManager, QueryRunner } from 'typeorm';
import type { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

import { typeormTransaction } from '../index';

class MockedEntityManager {}

class MockedQueryRunner
    implements
        Pick<
            QueryRunner,
            'manager' | 'connect' | 'startTransaction' | 'commitTransaction' | 'rollbackTransaction' | 'release'
        >
{
    manager: EntityManager = new MockedEntityManager() as EntityManager;

    connect(): Promise<void> {
        return Promise.resolve();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    startTransaction(isolationLevel?: IsolationLevel): Promise<void> {
        return Promise.resolve();
    }

    commitTransaction(): Promise<void> {
        return Promise.resolve();
    }

    rollbackTransaction(): Promise<void> {
        return Promise.resolve();
    }

    release(): Promise<void> {
        return Promise.resolve();
    }
}

class MockedDataSource implements Pick<DataSource, 'createQueryRunner'> {
    createQueryRunner(): QueryRunner {
        return new MockedQueryRunner() as QueryRunner;
    }
}

describe(`Test fn \`${typeormTransaction.name}\``, () => {
    it('should run transaction successfully', async () => {
        const spiedCreateQueryRunner = jest.spyOn(MockedDataSource.prototype, 'createQueryRunner');
        const spiedConnect = jest.spyOn(MockedQueryRunner.prototype, 'connect');
        const spiedStartTransaction = jest.spyOn(MockedQueryRunner.prototype, 'startTransaction');
        const spiedCommitTransaction = jest.spyOn(MockedQueryRunner.prototype, 'commitTransaction');
        const spiedRollbackTransaction = jest.spyOn(MockedQueryRunner.prototype, 'rollbackTransaction');
        const spiedRelease = jest.spyOn(MockedQueryRunner.prototype, 'release');

        expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(0);
        expect(spiedConnect).toHaveBeenCalledTimes(0);
        expect(spiedStartTransaction).toHaveBeenCalledTimes(0);
        expect(spiedCommitTransaction).toHaveBeenCalledTimes(0);
        expect(spiedRollbackTransaction).toHaveBeenCalledTimes(0);
        expect(spiedRelease).toHaveBeenCalledTimes(0);

        // when isolation level is not specified (Promise<Result>)
        {
            const result = await typeormTransaction(new MockedDataSource() as DataSource, () =>
                Promise.resolve(OkAsync(null)),
            );
            expect(result).toStrictEqual(Ok(null));

            expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(1);
            expect(spiedConnect).toHaveBeenCalledTimes(1);
            expect(spiedStartTransaction).toHaveBeenCalledTimes(1);
            expect(spiedCommitTransaction).toHaveBeenCalledTimes(1);
            expect(spiedRollbackTransaction).toHaveBeenCalledTimes(0);
            expect(spiedRelease).toHaveBeenCalledTimes(1);
        }

        // when isolation level is not specified (ResultAsync)
        {
            const result = await typeormTransaction(new MockedDataSource() as DataSource, () => OkAsync(null));
            expect(result).toStrictEqual(Ok(null));

            expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(2);
            expect(spiedConnect).toHaveBeenCalledTimes(2);
            expect(spiedStartTransaction).toHaveBeenCalledTimes(2);
            expect(spiedCommitTransaction).toHaveBeenCalledTimes(2);
            expect(spiedRollbackTransaction).toHaveBeenCalledTimes(0);
            expect(spiedRelease).toHaveBeenCalledTimes(2);
        }

        spiedStartTransaction.mockImplementation((value?: IsolationLevel) => {
            expect(value).toBe('SERIALIZABLE');
            return Promise.resolve();
        });

        // when isolation level is specified (Promise<Result>)
        {
            const result = await typeormTransaction(new MockedDataSource() as DataSource, 'SERIALIZABLE', () =>
                Promise.resolve(Ok(null)),
            );
            expect(result).toStrictEqual(Ok(null));

            expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(3);
            expect(spiedConnect).toHaveBeenCalledTimes(3);
            expect(spiedStartTransaction).toHaveBeenCalledTimes(3);
            expect(spiedCommitTransaction).toHaveBeenCalledTimes(3);
            expect(spiedRollbackTransaction).toHaveBeenCalledTimes(0);
            expect(spiedRelease).toHaveBeenCalledTimes(3);
        }

        // when isolation level is specified (ResultAsync)
        {
            const result = await typeormTransaction(new MockedDataSource() as DataSource, 'SERIALIZABLE', () =>
                OkAsync(null),
            );
            expect(result).toStrictEqual(Ok(null));

            expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(4);
            expect(spiedConnect).toHaveBeenCalledTimes(4);
            expect(spiedStartTransaction).toHaveBeenCalledTimes(4);
            expect(spiedCommitTransaction).toHaveBeenCalledTimes(4);
            expect(spiedRollbackTransaction).toHaveBeenCalledTimes(0);
            expect(spiedRelease).toHaveBeenCalledTimes(4);
        }
    });

    it('should rollback if transaction failes (return Err)', async () => {
        const spiedCreateQueryRunner = jest.spyOn(MockedDataSource.prototype, 'createQueryRunner');
        const spiedConnect = jest.spyOn(MockedQueryRunner.prototype, 'connect');
        const spiedStartTransaction = jest.spyOn(MockedQueryRunner.prototype, 'startTransaction');
        const spiedCommitTransaction = jest.spyOn(MockedQueryRunner.prototype, 'commitTransaction');
        const spiedRollbackTransaction = jest.spyOn(MockedQueryRunner.prototype, 'rollbackTransaction');
        const spiedRelease = jest.spyOn(MockedQueryRunner.prototype, 'release');

        expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(0);
        expect(spiedConnect).toHaveBeenCalledTimes(0);
        expect(spiedStartTransaction).toHaveBeenCalledTimes(0);
        expect(spiedCommitTransaction).toHaveBeenCalledTimes(0);
        expect(spiedRollbackTransaction).toHaveBeenCalledTimes(0);
        expect(spiedRelease).toHaveBeenCalledTimes(0);

        {
            const result = await typeormTransaction(new MockedDataSource() as DataSource, () =>
                Promise.resolve(Err(null)),
            );
            expect(result).toStrictEqual(Err(null));

            expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(1);
            expect(spiedConnect).toHaveBeenCalledTimes(1);
            expect(spiedStartTransaction).toHaveBeenCalledTimes(1);
            expect(spiedCommitTransaction).toHaveBeenCalledTimes(0);
            expect(spiedRollbackTransaction).toHaveBeenCalledTimes(1);
            expect(spiedRelease).toHaveBeenCalledTimes(1);
        }

        {
            const result = await typeormTransaction(new MockedDataSource() as DataSource, () => ErrAsync(null));
            expect(result).toStrictEqual(Err(null));

            expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(2);
            expect(spiedConnect).toHaveBeenCalledTimes(2);
            expect(spiedStartTransaction).toHaveBeenCalledTimes(2);
            expect(spiedCommitTransaction).toHaveBeenCalledTimes(0);
            expect(spiedRollbackTransaction).toHaveBeenCalledTimes(2);
            expect(spiedRelease).toHaveBeenCalledTimes(2);
        }
    });

    it('should rollback if transaction failes (throwing Error)', async () => {
        const spiedCreateQueryRunner = jest.spyOn(MockedDataSource.prototype, 'createQueryRunner');
        const spiedConnect = jest.spyOn(MockedQueryRunner.prototype, 'connect');
        const spiedStartTransaction = jest.spyOn(MockedQueryRunner.prototype, 'startTransaction');
        const spiedCommitTransaction = jest.spyOn(MockedQueryRunner.prototype, 'commitTransaction');
        const spiedRollbackTransaction = jest.spyOn(MockedQueryRunner.prototype, 'rollbackTransaction');
        const spiedRelease = jest.spyOn(MockedQueryRunner.prototype, 'release');

        expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(0);
        expect(spiedConnect).toHaveBeenCalledTimes(0);
        expect(spiedStartTransaction).toHaveBeenCalledTimes(0);
        expect(spiedCommitTransaction).toHaveBeenCalledTimes(0);
        expect(spiedRollbackTransaction).toHaveBeenCalledTimes(0);
        expect(spiedRelease).toHaveBeenCalledTimes(0);

        {
            const result = await typeormTransaction(new MockedDataSource() as DataSource, () => {
                throw new Error('error');
            });
            expect(result).toStrictEqual(Err(new Error('error')));

            expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(1);
            expect(spiedConnect).toHaveBeenCalledTimes(1);
            expect(spiedStartTransaction).toHaveBeenCalledTimes(1);
            expect(spiedCommitTransaction).toHaveBeenCalledTimes(0);
            expect(spiedRollbackTransaction).toHaveBeenCalledTimes(1);
            expect(spiedRelease).toHaveBeenCalledTimes(1);
        }

        {
            const result = await typeormTransaction(new MockedDataSource() as DataSource, () => {
                // eslint-disable-next-line no-throw-literal
                throw 'error';
            });
            expect(result).toStrictEqual(Err(new Error('error')));

            expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(2);
            expect(spiedConnect).toHaveBeenCalledTimes(2);
            expect(spiedStartTransaction).toHaveBeenCalledTimes(2);
            expect(spiedCommitTransaction).toHaveBeenCalledTimes(0);
            expect(spiedRollbackTransaction).toHaveBeenCalledTimes(2);
            expect(spiedRelease).toHaveBeenCalledTimes(2);
        }

        {
            const result = await typeormTransaction(new MockedDataSource() as DataSource, () => {
                // eslint-disable-next-line no-throw-literal
                throw false;
            });
            expect(result).toStrictEqual(Err(new Error('false')));

            expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(3);
            expect(spiedConnect).toHaveBeenCalledTimes(3);
            expect(spiedStartTransaction).toHaveBeenCalledTimes(3);
            expect(spiedCommitTransaction).toHaveBeenCalledTimes(0);
            expect(spiedRollbackTransaction).toHaveBeenCalledTimes(3);
            expect(spiedRelease).toHaveBeenCalledTimes(3);
        }
    });

    it('should not throw if rollbacking throws Error', async () => {
        const spiedCreateQueryRunner = jest.spyOn(MockedDataSource.prototype, 'createQueryRunner');
        const spiedConnect = jest.spyOn(MockedQueryRunner.prototype, 'connect');
        const spiedStartTransaction = jest.spyOn(MockedQueryRunner.prototype, 'startTransaction');
        const spiedCommitTransaction = jest.spyOn(MockedQueryRunner.prototype, 'commitTransaction');
        const spiedRollbackTransaction = jest
            .spyOn(MockedQueryRunner.prototype, 'rollbackTransaction')
            .mockImplementation(() => {
                throw new Error('error');
            });
        const spiedRelease = jest.spyOn(MockedQueryRunner.prototype, 'release');

        expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(0);
        expect(spiedConnect).toHaveBeenCalledTimes(0);
        expect(spiedStartTransaction).toHaveBeenCalledTimes(0);
        expect(spiedCommitTransaction).toHaveBeenCalledTimes(0);
        expect(spiedRollbackTransaction).toHaveBeenCalledTimes(0);
        expect(spiedRelease).toHaveBeenCalledTimes(0);

        {
            const result = await typeormTransaction(new MockedDataSource() as DataSource, () =>
                Promise.resolve(Err(null)),
            );
            expect(result).toStrictEqual(Err(null));

            expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(1);
            expect(spiedConnect).toHaveBeenCalledTimes(1);
            expect(spiedStartTransaction).toHaveBeenCalledTimes(1);
            expect(spiedCommitTransaction).toHaveBeenCalledTimes(0);
            expect(spiedRollbackTransaction).toHaveBeenCalledTimes(1);
            expect(spiedRelease).toHaveBeenCalledTimes(1);
        }

        {
            const result = await typeormTransaction(new MockedDataSource() as DataSource, () => {
                throw new Error('error');
            });
            expect(result).toStrictEqual(Err(new Error('error')));

            expect(spiedCreateQueryRunner).toHaveBeenCalledTimes(2);
            expect(spiedConnect).toHaveBeenCalledTimes(2);
            expect(spiedStartTransaction).toHaveBeenCalledTimes(2);
            expect(spiedCommitTransaction).toHaveBeenCalledTimes(0);
            expect(spiedRollbackTransaction).toHaveBeenCalledTimes(2);
            expect(spiedRelease).toHaveBeenCalledTimes(2);
        }
    });
});
