<script lang="ts">
    import type {Queryable} from "../data/model/queryable.ts";

    let { queryable }: { queryable: Queryable } = $props();
</script>
{#if queryable.kind === "stop"}
    <div class="h-full w-full">
        <p>
            {queryable.name}
        </p>
    </div>
{:else if queryable.kind === "route"}
    <div class="h-full w-full">
        <p>
            {queryable.route_short_name}
        </p>
    </div>
{/if}