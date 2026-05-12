---
title: "Understanding Reciprocal Rank Fusion - Step by Step"
date: 2026-05-12
tags: [LangChain4J, Reranking, RAG, Context Engineering]
description: "Implement Reciprocal Rank Fusion to develop an intuition on how it works"
---
When building Retrieval Augmented Generation (RAG) systems, we may rely on multiple approaches / criteria to find the most relevant chunks of information from the knowledge bases. Different approaches can have different rankings for the perceived closeness of the chunk of information to the user query. Reciprocal rank fusion attempts to reconcile the ranked chunk information from each approach and arrives at a consolidated rank based on the rank of the chunk in each approach.

In its simplest form, reciprocal rank fusion helps to find a consolidated ranked list of items from multiple buckets. The items ranked higher in multiple buckets gets higher preference in the consolidated list and the vice versa.

# The Algorithm
## Terminologies
- Chunk - The element ranked across multiple buckets.
- Bucket - Each bucket contains the chunks ranked based on its own algorithms.
- Rank - The rank of the chunk in each bucket.
## The Algorithm - TLDR
Each chunk is assigned a score based on the rank it was assigned in each of the buckets. Lower ranked elements in a bucket would receive higher scores.The scores are added across multiple buckets and the consolidated list is sorted based on the consolidated score in descending order
## The Algorithm - In depth
- To calculate the score of a chunk in each bucket, we calculate the reciprocal (1/n) of the rank added with a smoothening constant **k**.

```java
double rrf(int rank) {
    return 1 / (k + rank);
}
```

- For a moment, let's consider that we discard the smoothening factor by assinging k = 0, let' see the scores that would be assigned for each rank.
> k = 0


| Rank  | 1 | 2   | 3    | 4    |
|-------|---|-----|------|------|
| Score | 1 | 0.5 | 0.33 | 0.25 |

- It is easy to note that the 1st ranked chunk gets a score twice that of the second ranked element.
- This distorts the final results since a element ranked first in one of the bucket and ranked last in another bucket would be ranked higher than a chunk that is ranked second in two buckets.
- Let's consider the scores when the smoothening factor is chosen to be 100.
> k = 100

| Rank  | 1      | 2      | 20     | 40    |
|-------|--------|--------|--------|-------|
| Score | 0.0099 | 0.0098 | 0.0083 | 0.007 |

- We can see that the first ranked element has a score that is only 1% more than the second ranked result, yet it has a 20% higher score over the 20th ranked element.
- This primary intuition drives the effectiveness of this scoring function. Closer ranked elements are assigned closer scores and the first few ranks do not skew the scores too much.
