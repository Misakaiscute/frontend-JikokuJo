<script lang="ts">
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";
    import QueryableDropdownItem from "./QueryableDropdownItem.svelte";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext()
</script>
{#if scheduleSearchController.filteredQueryables.length > 0}
    <div class="flex-[1_0_auto] max-h-[36rem] flex flex-col justify-center w-full
            mt-1 p-0.5 rounded-md bg-zinc-200 overflow-y-auto">
        {#each scheduleSearchController.filteredQueryables as queryable}
            <QueryableDropdownItem {queryable}/>
        {/each}
    </div>
{/if}