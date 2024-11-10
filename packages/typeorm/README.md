# @rustresult/typeorm

This package provides some helpers that can help you use `typeorm`.

## Table Of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

```sh
> npm install @rustresult/typeorm
> yarn add @rustresult/typeorm
> pnpm install @rustresult/typeorm
```

## Usage

- `typeormTransaction`

A helper function that helps you run you queries inside a transaction in `Result` style.

```ts
import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { typeormTransaction } from '@rustresult/typeorm';
import { DataSource, type InsertResult } from 'typeorm';

@Injectable()
class Service {
  constructor(private dataSource: DataSource) {}

  async create(...): Promise<Result<number, HttpException>>  {
    const result = await typeormTransaction(
      this.dataSource,
      async (manager): Promise<Result<InsertResult, HttpException | Error>> => {
        const passCheck = await checkSomething(manager, ...);
        if (!passCheck) {
          // log something
          return Err(new ConflictException('errmsg'));
        }

        return resultifyPromise<InsertResult, Error>(manager.insert(Entity, { ... }));
      },
    );

    return result
      .inspect(() => {
        // log something
      })
      .inspectErr((err) => {
        if (!(err instanceof HttpException)) {
          // log something
        }
      })
      .map((insertResult) => insertResult.identifiers[0].id as number)
      .mapErr((err) =>
        err instanceof HttpException ? err : new UnprocessableEntityException('errmsg'),
      );
  }
}
```
