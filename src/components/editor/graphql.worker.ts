/**
 *  Copyright (c) 2021 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import type { worker as WorkerNamespace } from 'monaco-editor'
import { ICreateData } from 'monaco-graphql/dist/typings'

// @ts-ignore
import * as worker from 'monaco-editor/esm/vs/editor/editor.worker'

import { GraphQLWorker } from 'monaco-graphql/dist/GraphQLWorker'

self.onmessage = () => {
  try {
    worker.initialize((ctx: WorkerNamespace.IWorkerContext, createData: ICreateData) => {
      console.log('worker')
      return new GraphQLWorker(ctx, createData)
    })
  } catch (err) {
    console.error(err)
  }
}
