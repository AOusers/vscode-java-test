// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import { AddressInfo } from 'net';
import { DebugConfiguration } from 'vscode';
import { BaseRunner } from '../baseRunner/BaseRunner';
import { BaseRunnerResultAnalyzer } from '../baseRunner/BaseRunnerResultAnalyzer';
import { JUnitRunnerResultAnalyzer } from './JUnitRunnerResultAnalyzer';

export class JUnitRunner extends BaseRunner {

    public async run(launchConfiguration: DebugConfiguration): Promise<Set<string>> {
        if (launchConfiguration.args) {
            // We need to replace the socket port number since the socket is established from the client side.
            // The port number returned from the server side is a fake one.
            const args: string[] = launchConfiguration.args as string[];
            const portIndex: number = args.lastIndexOf('-port');
            if (portIndex > -1 && portIndex + 1 < args.length) {
                args[portIndex + 1] = `${(this.server.address() as AddressInfo).port}`;
            } else {
                args.push('-port', `${(this.server.address() as AddressInfo).port}`);
            }
        }
        return super.run(launchConfiguration);
    }

    protected get testResultAnalyzer(): BaseRunnerResultAnalyzer {
        if (!this.runnerResultAnalyzer) {
            this.runnerResultAnalyzer = new JUnitRunnerResultAnalyzer(this.context.projectName);
        }
        return this.runnerResultAnalyzer;
    }
}
