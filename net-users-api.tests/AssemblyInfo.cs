using Xunit;

// Controller and HTTP tests share the API's process-wide mutable user list.
[assembly: CollectionBehavior(DisableTestParallelization = true)]
