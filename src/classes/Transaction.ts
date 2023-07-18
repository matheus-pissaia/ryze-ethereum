import { JsonRpcSigner, PreparedTransactionRequest } from 'ethers'

export class Transaction {
    /**
     * Constructs a new Transaction instance.
     *
     * @param transaction - PreparedTransactionRequest object containing transaction details.
     * @param signer - Signer object to sign and send the transaction.
     */
    public constructor(
        public readonly transaction: PreparedTransactionRequest,
        public readonly signer: JsonRpcSigner,
    ) {
    }

    /**
     * Asynchronously initializes a Transaction instance.
     *
     * The gas limit of the transaction is estimated by the signer and multiplied
     * by the provided gas multiplier (in thousandths). For example, a gasMultiplier
     * of 1_000 means no increase in the estimated gas limit, whereas 2_000 doubles it.
     *
     * @param transaction - PreparedTransactionRequest object containing transaction details.
     * @param signer - Signer object to estimate gas and sign the transaction.
     * @param gasMultiplier - Multiplier for estimating the gas limit.
     * @returns - A promise that resolves to a new Transaction instance.
     */
    public static async initialize(
        transaction: PreparedTransactionRequest,
        signer: JsonRpcSigner,
        gasMultiplier: bigint,
    ) {
        const gasLimit = (await signer.estimateGas(transaction)) * gasMultiplier / 1_000n

        return new Transaction(
            {
                ...transaction,
                gasLimit,
            },
            signer,
        )
    }

    /**
     * Sends the transaction using the signer provided during the initialization.
     *
     * @returns - A promise that resolves to the transaction receipt upon successful transaction.
     */
    public send() {
        return this.signer.sendTransaction(this.transaction)
    }
}