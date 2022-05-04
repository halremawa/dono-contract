import { PersistentUnorderedMap, u128, context } from "near-sdk-as";

@nearBindgen
export class Cause {
    //id should be wallet id
    id: string;
    name: string;
    description: string;
    summary: string;
    image: string;
    location: string;
    totDonated: u128;
    owner: string;
    totNoOfDonors: u32;
    totNoOfComments: u32;
    avgRating: u32;
    timeStamp: u64;
    isEdited: boolean;
    editTimeStamp: u64;
    public static fromPayload(payload: Cause): Cause {
        const cause = new Cause();
        cause.id = payload.id;
        cause.name = payload.name;
        cause.description = payload.description;
        cause.image = payload.image;
        cause.location = payload.location;
        cause.avgRating = payload.avgRating;
        cause.summary = payload.summary;
        cause.owner = context.sender;
        cause.timeStamp = payload.timeStamp;
        cause.totDonated = payload.totDonated;
        cause.totNoOfComments = payload.totNoOfComments;
        cause.totNoOfDonors = payload.totNoOfDonors;
        cause.timeStamp = payload.timeStamp;
        cause.isEdited = payload.isEdited;
        return cause;
    }
    public incrementSoldAmount(): void {
        this.sold = this.sold + 1;
    }
}

export const listedCauses = new PersistentUnorderedMap<string, Cause>("LISTED_CAUSES");

@nearBindgen
export class Comment {
    id: string;
    comment: string;
    totDonated: u128;
    owner: string;
    rating: u32;
    causeId: string;
    isEdited: boolean;
    timeStamp: u64;
    editTimeStamp: u64;
    public static fromPayload(payload: Comment): Comment {
        const comment = new Comment();
        comment.id = payload.id;
        comment.causeId = payload.causeId;
        comment.comment = payload.comment;
        comment.editTimeStamp = payload.editTimeStamp;
        comment.isEdited = payload.isEdited;
        comment.rating = payload.rating;
        comment.timeStamp = payload.timeStamp;
        comment.owner = context.sender;
        comment.totDonated = payload.totDonated;
        return comment;
    }
    public incrementSoldAmount(): void {
        this.sold = this.sold + 1;
    }
}

export const listedComments = new PersistentUnorderedMap<string, Comment>("LISTED_COMMENTS");


@nearBindgen
export class Transaction {
    //this is id of transaction as given by near
    id: string;
    causeId: string;
    //causeWalletId: string;
    causeName: string;
    totDonated: u128;
    owner: string;
    timeStamp: u64;
    public static fromPayload(payload: Transaction): Transaction {
        const transaction = new Transaction();
        transaction.id = payload.id;
        transaction.causeId = payload.causeId;
        transaction.totDonated = payload.totDonated;
        transaction.timeStamp = payload.timeStamp;
        transaction.causeName = payload.causeName;
        //transaction.causeWalletId = payload.causeWalletId;
        transaction.owner = context.sender;
        return transaction;
    }
    public incrementSoldAmount(): void {
        this.sold = this.sold + 1;
    }
}

export const listedTransactions = new PersistentUnorderedMap<string, Transaction>("LISTED_TRANSACTIONS");


@nearBindgen
export class User {
    //this is id of transaction as given by near
    id: string;
    totDonated: u128;
    totDonations: u32;
    public static fromPayload(payload: User): User {
        const user = new User();
        user.id = payload.id;
        user.totDonated = payload.totDonated;
        user.totDonations = payload.totDonations;
        return user;
    }
    public incrementSoldAmount(): void {
        this.sold = this.sold + 1;
    }
}

export const listedUsers = new PersistentUnorderedMap<string, Cause>("LISTED_USERS");