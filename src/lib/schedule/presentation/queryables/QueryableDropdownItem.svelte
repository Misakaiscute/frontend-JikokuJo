<script lang="ts">
    import type {Queryable} from "../../data/model/queryable.ts";
    import ScheduleSearchController from "../scheduleSearchController.svelte.ts";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext()
    let { queryable }: { queryable: Queryable } = $props();

    const onQueryableClick = (queryable: Queryable): void => {
        if (queryable.kind === "route"){
            scheduleSearchController.searchString = queryable.short_name;
        } else {
            scheduleSearchController.searchString = queryable.name
        }
        scheduleSearchController.selectedQueryable = queryable;
        scheduleSearchController.dropdownShown = false;
    }
</script>
{#if queryable.kind === "stop"}
    <div id="queryable-item" title="{queryable.name}"
        class="flex-[0_0_auto] h-10 w-full bg-white rounded-md flex items-center hover:cursor-pointer">
        <div role="button" tabindex="-1"
            class="h-full w-full px-2 flex items-center justify-start border-2 border-zinc-200 rounded-md
                   transition-all duration-300 hover:cursor-pointer hover:border-zinc-800"
            onclick={() => { onQueryableClick(queryable); }} onkeydown={() => {}}
        >
            <p class="font-medium text-zinc-800 truncate">{queryable.name}</p>
        </div>
    </div>
{:else if queryable.kind === "route"}
    <div id="queryable-item" style="--route-color: {'#' + (queryable.color ?? '000000')};" title="{queryable.short_name}"
        class="flex-[0_0_auto] h-10 w-full bg-white rounded-md flex items-center transition-colors duration-200
            hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--route-color)_15%,white)]">
        <div role="button" tabindex="-1"
            class="h-full w-full px-2 flex items-center justify-start border-2 border-(--route-color) rounded-md
                transition-all duration-300 hover:cursor-pointer"
            onclick={() => { onQueryableClick(queryable); }} onkeydown={() => {}}
        >
            <p class="font-medium text-zinc-800 truncate">{queryable.short_name}</p>
        </div>
    </div>
{/if}