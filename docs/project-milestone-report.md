# Project Milestone Report

## URL

[Milestone Report](https://xinyu-li-123.github.io/15418-project-site/project-milestone-report.html)

<https://xinyu-li-123.github.io/15418-project-site/>

## Schedule for the next two weeks

For each half-week, we plan to do

|            Half-Week             |                             Task                             |
| :-------------------------: | :----------------------------------------------------------: |
|   week 1 (Mar 25 -Mar 31)   | Identify a strong CPU based JSON processing baseline from existing state of the art implementations and begin developing our GPU based system. |

- Apr 15 \- Apr 17  
  - Integrate the four subsystems and run our impl on smaller dataset (1KB, 100KB, 100MB) on GHC machine \[Rui\]  
  - Design and implement kernel optimization based on paper’s evaluation section and our understanding of codebase \[Xinyu\]  
- Apr 18 \- Apr 21  
  - Run original GpJSON on larger dataset (1GB, 2GB) on GHC / AWS and profile result with nsight to find bottlenecks  
  - Adjust / redesign kernel optimization based on profiling results  
- Apr 22 \- Apr 24  
  - Adjust / redesign kernel optimization based on profiling results  
  - Run baseline model against large dataset and collect results  
- Apr 25 \- Apr 27  
  - Report  
  - Poster  
  - If previous items are not finished in time, we will use these three days as extension  
- Apr 28 \- Apr 30  
  - Report  
  - Poster

At the end of each half-week, we will have a meeting to decide work assignment for the next half-week.

## What have we completed so far?

First, we have almost finished implementing GpJSON based on the original paper and java codebase. We split our cpp codebase into four modular subsystems that handles cuda memory management, index building, file access, and query parsing / execution. We have implemented all four subsystems, and use AI to generate unit test for each subsystem. But we haven’t finished integrating the four subsystems.

In terms of kernel optimization, we have some initial ideas for how to optimize the kernel design of the original paper and codebase, but we haven’t come up with any full design yet. We have thought of 4 ways

- We can fuse certain kernels to reduce memory footprint. For example, we may be able to compute the string index using fewer kernels without materializing escape and quote index.  
- We can use shared memory instead of global memory to speed up computation.  
- We can use Thrust (or other libraries) to optimize some kernels. E.g. the original codebase has a custom implementation of exclusive scan.  
- (unsure) We may be able to reduce the dependency on carry index by using synchronization within each thread block. Currently, carry index acts as a synchronization between all cuda threads.

## How is current progress compared to our goal?

A bit behind, but overall good. We initially plan to have a working but unoptimized impl of GpJSON right now. We have finished each component, but haven’t finished integrating them.

## What to show for the poster session?

A graph that compares performance on a large dataset of baseline (e.g. simdjson), original gpjson impl, our optimized gpjson impl.

A graph that compares the performance and memory usage of the paper’s GpJSON design and our optimized version.

## Any preliminary results?

No.

## List the issues that concern you most

- Our GPU is not as powerful as the A100 cluster that the original paper used.  
- GHC machines have storage limits, so we can’t test on larger dataset. This may be solvable, but we don’t know how. We may instead do large-scale tests on AWS.  
- Some of our optimizations may not be working.  
- We may not be able to compare the original java implementation with our unoptimized cpp implementation of GpJSON, since that version depends on GrCUDA for async impl, while we decide not to support that.
