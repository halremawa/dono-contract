import { Cause, Comment,Transaction,User,listedCauses,listedComments,listedTransactions,listedUsers } from './models';
import { ContractPromiseBatch, context, u128 } from 'near-sdk-as';

//functions - cause

export function addCause(cause: Cause): void {
    const storedCause = listedCauses.get(cause.id);
    if (storedCause !== null) {
        throw new Error(`a cause with ${cause.id} already exists`);
    }
    const c=Cause.fromPayload(cause);
    c.timeStamp=context.blockTimestamp;
    listedCauses.set(cause.id, c);
}

export function updateCause(cause: Cause): void {
    const storedCause = listedCauses.get(cause.id);
    if (storedCause === null) {
        throw new Error(`cause with ${cause.id} does not exist`);
    }
    if(storedCause.owner !== context.sender) {
        throw new Error(`you are not the owner of this cause`);
    }
    const c=Cause.fromPayload(cause);
    c.editTimeStamp=context.blockTimestamp;
    c.isEdited=true;
    listedCauses.set(cause.id, c);
}

export function getCause(id: string): Cause | null {
    const storedCause = listedCauses.get(id);
    if (storedCause === null) {
        throw new Error(`cause with ${id} does not exist`);
    }
    return storedCause;
}

export function getCauses(): Cause[] {
    const causes= listedCauses.values();
    //sort causes by descending timeStamp
    causes.sort((a,b) => b.timeStamp - a.timeStamp);
    return causes;
}
//functions - transaction

export function addTransaction(transaction: Transaction): void {
    
    const c=Transaction.fromPayload(transaction);
    const cause=listedCauses.get(transaction.causeId);
    if(cause===null) {
        throw new Error(`cause with ${transaction.causeId} does not exist`);
    }

    ContractPromiseBatch.create(transaction.causeId).transfer(context.attachedDeposit);
    c.timeStamp=context.blockTimestamp;
    listedTransactions.set(transaction.id, c);

    cause.totDonated= u128.add(cause.totDonated,context.attachedDeposit);
    const causeTransactions=getTransactionsForCause(transaction.causeId);
    //get the unique amount of donors from the cause transactions
    const uniqueDonors=causeTransactions.map(t=>t.owner).filter((v,i,a)=>a.indexOf(v)===i);
    cause.totNoOfDonors=uniqueDonors.length;

}


export function getTransaction(id: string): Transaction | null {
    const storedTransaction = listedTransactions.get(id);
    if (storedTransaction === null) {
        throw new Error(`transaction with ${id} does not exist`);
    }
    return storedTransaction;
}


export function getTransactions(): Transaction[] {
    const transactions= listedTransactions.values();
    //sort transactions by descending timeStamp
    transactions.sort((a,b) => b.timeStamp - a.timeStamp);
    return transactions;
}

export function getTransactionsForCause(causeId:string): Transaction[] {
    const transactions= listedTransactions.values().filter(t=>t.causeId===causeId);
    //sort transactions by descending timeStamp
    transactions.sort((a,b) => b.timeStamp - a.timeStamp);
    return transactions;
}

export function getTransactionsForUser(userId:string): Transaction[] {
    const transactions= listedTransactions.values().filter(t=>t.owner===userId);
    //sort transactions by descending timeStamp
    transactions.sort((a,b) => b.timeStamp - a.timeStamp);
    return transactions;
}

//functions - comment

export function addComment(comment: Comment): void {
    let storedComment = listedComments.get(comment.id);
    if (storedComment !== null) {
        throw new Error(`a comment with ${comment.id} already exists`);
    }
    
    //check if user has already commented on this cause
    const comments= listedComments.values();
    for(let i=0;i<comments.length;i++){
        if(comments[i].causeId===comment.causeId && comments[i].owner===context.sender){
            throw new Error(`you have already commented on this cause`);
        }
    }
    listedComments.set(comment.id, Comment.fromPayload(comment));
}

export function updateComment(comment: Comment): void {
    let storedComment = listedComments.get(comment.id);
    if (storedComment === null) {
        throw new Error(`comment with ${comment.id} does not exist`);
    }
    if(storedComment.owner !== context.sender) {
        throw new Error(`you are not the owner of this comment`);
    }
    listedComments.set(comment.id, Comment.fromPayload(comment));
}

export function getComment(id: string): Comment | null {
    let storedComment = listedComments.get(id);
    if (storedComment === null) {
        throw new Error(`comment with ${id} does not exist`);
    }
    return storedComment;
}

export function getComments(): Comment[] {
    let comments= listedComments.values();
    //sort comments by descending timeStamp
    comments.sort((a,b) => b.timeStamp - a.timeStamp);
    return comments;
}


export function buyProduct(productId: string): void {
    const product = getProduct(productId);
    if (product == null) {
        throw new Error("product not found");
    }
    if (product.price.toString() != context.attachedDeposit.toString()) {
        throw new Error("attached deposit should equal to the product's price");
    }
    ContractPromiseBatch.create(product.owner).transfer(context.attachedDeposit);
    product.incrementSoldAmount();
    listedProducts.set(product.id, product);
}


// export function deleteProduct(productId: string): void {
//     const product = getProduct(productId);
//     if (product == null) {
//         throw new Error("product not found");
//     }
//     listedProducts.delete(productId);
// }