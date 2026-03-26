<script lang="ts">
    import { slide } from "svelte/transition";

    import ScheduleSearchController from "../scheduleSearchController.svelte.ts";
    import QueryableQueryableDropdownItem from "./QueryableDropdownItem.svelte";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();
</script>
{#if scheduleSearchController.filteredQueryables.length > 0 && scheduleSearchController.dropdownShown}
    <div transition:slide={{ duration: 200 }} class="flex-[1_0_auto] max-h-[60svh] w-full mt-1">
        <div class="h-full w-full flex flex-col p-0.5 rounded-md bg-zinc-200 overflow-y-auto">
            {#each scheduleSearchController.filteredQueryables as queryable}
                <QueryableQueryableDropdownItem {queryable}/>
            {/each}
        </div>
    </div>
{/if}