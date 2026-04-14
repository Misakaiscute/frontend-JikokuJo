<script lang="ts">
    import type {Queryable} from "../../data/model/queryable.ts";
    import ScheduleSearchController from "../scheduleSearchController.svelte.ts";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext()
    let { queryable }: { queryable: Queryable } = $props();
</script>
<!-- svelte-ignore a11y_click_events_have_key_events -->
{#if queryable.kind === "stop"}
    <div id="queryable-item" class="flex-[0_0_auto] h-10 w-full bg-white rounded-md flex items-center hover:cursor-pointer">
        <div role="button" tabindex="-1"
            class="h-full w-full px-2 flex items-center justify-start border-2 border-zinc-200 rounded-md
                   transition-all duration-300 hover:cursor-pointer hover:border-zinc-800"
            onclick={() => {
                scheduleSearchController.selectedQueryable = queryable;
                scheduleSearchController.searchString = queryable.name;
                scheduleSearchController.dropdownShown = false;
            }}
        ><p class="truncate">{queryable.name}</p></div>
    </div>
{:else if queryable.kind === "route"}
    <div id="queryable-item" style="--route-color: {'#' + (queryable.color ?? '000000')};"
         class="flex-[0_0_auto] h-10 w-full bg-white rounded-md flex items-center transition-colors duration-200
                hover:cursor-pointer hover:bg-[color-mix(in_srgb,var(--route-color)_15%,white)]">
         <div role="button" tabindex="-1"
             class="h-full w-full px-2 flex items-center justify-start border-2 border-[var(--route-color)] rounded-md
                    transition-all duration-300 hover:cursor-pointer"
             onclick={() => {
                 scheduleSearchController.searchString = queryable.route_short_name;
                 scheduleSearchController.selectedQueryable = queryable;
                 scheduleSearchController.dropdownShown = false;
             }}
         ><p class="truncate">{queryable.route_short_name}</p></div>
    </div>
{/if}