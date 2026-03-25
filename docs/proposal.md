# GPU Accelerated JSON Data Processing

## Proposal

Xinyu Li(xinyuli4)

Rui Zhang(ruiz3)

## URL

[Project Proposal](http://xinyu-li-123.github.io/15418-project-site/proposal.html)

## Summary

We are going to build a GPU accelerated prototype for processing newline delimited JSON, inspired by the VLDB paper GpJSON, and evaluate whether semi structured text can be queried efficiently without fully materializing parsed objects. We will foucs on parallel construction of indexes and direct query execution over indexed text. We will compare GPU based implementation against a CPU baseline.

## Background

JSON is one of the most widely used formats for semi structured data in modern systems, including web services, logs, and data exchange pipelines. However, JSON processing is often expensive because the data is stored as raw text with nested and irregular structure. Unlike structured tabular data, JSON requires the system to identify record boundaries, recognize structural characters such as braces and commas, handle quoted strings correctly, and navigate nested fields during query execution. These steps make JSON parsing and querying relatively costly, especially when the dataset is large.

While JSON parsing and querying are relatively costly using CPU, the high level idea is to explore whether newline delimited JSON can be processed more efficiently by using the GPU for the main processing pipeline. Instead of fully converting each JSON record into an in memory object representation first, we want to build structural indexes directly over the raw JSON text and then use those indexes to support simple query operations. This allows us to study whether GPUs can help accelerate a workload that is traditionally viewed as irregular and CPU oriented.

## The Challenge

The first challenge is processing JSON correctly. JSON is a text based, semi structured, and hierarchical format rather than a fixed width table. To process it correctly, we must not only scan the input text, but also identify record boundaries, detect structural characters such as braces, brackets, colons, and commas, distinguish characters inside quoted strings from true structural symbols, and keep track of nesting levels. These requirements introduce control dependencies and irregular access patterns that are much more complicated than those in regular numeric workloads.

Another challenge is about the workload. The workload may exhibit divergent execution. Different JSON records can have different lengths, different nesting depths, and different string contents, so different GPU threads may follow different control paths during parsing or querying. For example, one record may contain the target key near the beginning, while another may require scanning much further or descending deeper into the structure. Query predicates can also create divergence, since some records may match early and others may fail late. This kind of branch divergence is exactly the sort of behavior that tends to reduce efficiency on GPUs since GPUs are designed for massive throughput on workloads with regular control flow and predictable memory access, whereas JSON processing is irregular in both structure and execution. The challenge is therefore not only to expose enough parallel work, but also to organize it in a way that reduces irregularity and divergence.

From a memory perspective, JSON processing is challenging because the data is stored as irregular text rather than in a regular columnar or fixed width layout. This makes it difficult to achieve coalesced memory access on the GPU, since different threads may need to examine different positions in the input and may follow different paths when navigating nested structures or locating specific fields. In other words, even when many threads are processing JSON records in parallel, their accesses to the underlying text are often not well aligned, which can reduce memory efficiency. Moreover, Locality is also difficult to guarantee since the positions of keys and values can vary significantly across records because of variable length fields, optional attributes, and different nesting patterns. As a result, the same logical field may appear at very different offsets in different records, making memory accesses less regular and reducing both spatial and temporal locality.

In terms of the data size. For very large JSON datasets, the entire input may not fit in GPU memory at once. In that case, it requires GPU out-of-core execution to multiple iterations to move data into main memory, process, and store results back. This can become a major bottleneck, especially for workloads where the computation per byte is relatively low. Therefore, how to divide datasets into chunks and how to reduce data transfers would be a great challenge since transferring large JSON data can significantly limit performance.

## Resources

we plan to build the system in C++/CUDA while taking inspiration from the design idea presented in this [VLDB paper](https://atlarge-research.com/pdfs/2025-vldb-gpjson.pdf). In addition to the paper, we will also study the authors’ [open-source GpJSON implementation in Java/CUDA](https://github.com/koesie10/gpjson) as a reference. Our implementation will start directly from the input JSON text, with the goal of constructing structural indexes that capture the organization of the data. Based on these indexes, we will then implement a query executor that can perform basic query operations over the indexed JSON records.

The development compute resources would be GHC machines with RTX 2080 GPU. And possibly we also would like to run experiments on our own computer with RTX 5090 GPU or AWS EC2 instances. This allows us to evaluate the design under both a more limited and a more powerful setting.

## Goals and Deliverables

1. Build a simplified JSON processing prototype in C++ and CUDA for newline delimited JSON. Starting from raw input JSON text and constructing basic structural indexes over the data.
2. Implement a query executor that uses the indexes to support a small set of representative queries.
3. Evaluate the performance of the GPU based approach against the CPU baseline on datasets of different sizes and structures.
4. **Extra**: Extend the query executor to support a richer subset of JSONPath style queries.

## Platform Choice

We will choose Linux with NVIDIA GPUs with modern CUDA support as our platforms. The implementation will be written in C++ and CUDA.

## Schedule

|            Week             |                             Task                             |
| :-------------------------: | :----------------------------------------------------------: |
|   week 1 (Mar 25 -Mar 31)   | Identify a strong CPU based JSON processing baseline from existing state of the art implementations and begin developing our GPU based system. |
|    week 2 (Apr 1- Apr 7)    | Implement the structural indexing stage for the input newline delimited JSON data. |
|   week 3 (Apr 8 - Apr 14)   | Implement the query executor based on the constructed indexes and prepare the milestone report. |
|  week 4 (Apr 15 - Apr 21)   | Conduct testing and performance evaluation of the full system. |
| week 5 & 6 (Apr 22- Apr 30) |      Analyze the results and prepare the final report.       |
