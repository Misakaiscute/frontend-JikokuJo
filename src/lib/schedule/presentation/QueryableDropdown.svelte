<script lang="ts">
    import { slide } from "svelte/transition";
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";
    import QueryableDropdownItem from "./QueryableDropdownItem.svelte";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext()
</script>
{#if scheduleSearchController.filteredQueryables.length > 0 && scheduleSearchController.dropdownShown}
    <div transition:slide={{ duration: 200 }} class="flex-[1_0_auto] max-h-[60svh] w-full mt-1 overflow-y-auto transition-all">
        <div class="flex h-full w-full flex-col p-0.5 justify-center rounded-md bg-zinc-200">
            {#each scheduleSearchController.filteredQueryables as queryable}
                <QueryableDropdownItem {queryable}/>
            {/each}
        </div>
    </div>
{/if}