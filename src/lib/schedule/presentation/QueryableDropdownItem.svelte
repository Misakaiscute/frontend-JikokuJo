<script lang="ts">
    import type {Queryable} from "../data/model/queryable.ts";
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext()
    let { queryable }: { queryable: Queryable } = $props();
</script>
{#if queryable.kind === "stop"}
    <div class="flex-[0_0_auto] h-10 w-full my-0.25 bg-white rounded-md flex items-center hover:cursor-pointer">
        <button
            aria-label="{queryable.name}"
            class="h-full w-full px-2 flex items-center justify-start truncate transition-all duration-300 hover:cursor-pointer hover:shadow-sm/20"
            onclick="{() => {scheduleSearchController.selectedQueryable = queryable}}"
        >{queryable.name}</button>
    </div>
{:else if queryable.kind === "route"}
    <div style="background: {queryable.color ? '#' + queryable.color : '#000000'}"
         class="flex-[0_0_auto] h-10 w-full my-0.25 rounded-md flex items-center hover:cursor-pointer">
         <button
             aria-label="{queryable.route_short_name}"
             class="h-full w-full px-2 flex items-center justify-start truncate transition-all duration-300 hover:cursor-pointer hover:shadow-sm/20"
             onclick="{() => {scheduleSearchController.selectedQueryable = queryable}}"
         >{queryable.route_short_name}</button>
    </div>
{/if}