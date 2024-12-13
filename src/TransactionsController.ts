import { Controller, Route, Post, Body, Tags } from 'tsoa';
import { ethers } from 'ethers';
import { Session } from '@0xsequence/auth';
import { findSupportedNetwork } from '@0xsequence/network';
import * as dotenv from 'dotenv';
import { text } from 'express';
dotenv.config();


interface Transaction {
    to: string;
    value: string;
    data: string;
}

interface CreateTransactionsRequest {
    transactions: Transaction[];
    chainId: number;
    systemWalletId: string;
}

interface TransactionResponse {
    txHash: string;
}

@Route('transactions')
@Tags('Transactions')
export class TransactionsController extends Controller {
    @Post('create')
    public async createTransactions(
        @Body() requestBody: CreateTransactionsRequest
    ): Promise<TransactionResponse | undefined> {
        const {transactions, systemWalletId, chainId} = requestBody;
        const signer = await this.getSigner(chainId.toString(), systemWalletId);
        try{
            const result = await signer.sendTransaction(transactions);
            console.log(result);
            return {
                txHash: result.hash
            }
        }
        catch (e) {
            console.log(e);
        }
    }
        

    private async getSigner(chainHandle: string, systemWalletId: string = 'main') {
        const chainConfig = findSupportedNetwork(chainHandle)!;
        const provider = new ethers.JsonRpcProvider(chainConfig.rpcUrl);
        const PK = process.env[`PRIVATE_KEY_${systemWalletId.toUpperCase()}`];
        console.log(PK)
        const walletEOA = new ethers.Wallet(PK!, provider);
        
        const session = await Session.singleSigner({
            signer: walletEOA,
            projectAccessKey: process.env.PROJECT_ACCESS_KEY!
        });
        
        return session.account.getSigner(chainConfig.chainId);
    }
}