<script lang="ts">

    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";
    import QueryableDropdownItem from "./QueryableDropdownItem.svelte";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext()
    const itemHeight: number = 8;
</script>
<div class="flex-[1_0_auto] flex flex-col justify-center w-full mt-1 rounded-md bg-zinc-200">
    {#each scheduleSearchController.filteredQueryables as queryable, index}
        <div class="h-[{itemHeight}] w-full">
            <p>
                <QueryableDropdownItem {queryable}/>
            </p>
        </div>
    {/each}
</div>