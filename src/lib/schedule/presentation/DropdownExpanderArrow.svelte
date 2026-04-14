<script lang="ts">
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";
    import TripSelectionController from "./tripSelectionController.svelte.ts";
    import ActionController from "./actionController.svelte.ts";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();
    const tripSelectionController: TripSelectionController = TripSelectionController.getTripSelectionControllerContext();
    const actionController: ActionController = ActionController.getActionControllerContext();

    const onclick = () => {
        switch (actionController.currAction) {
            case "queryableSearch":
                scheduleSearchController.dropdownShown = !scheduleSearchController.dropdownShown;
                break;
            case "tripSelection":
                tripSelectionController.dropdownShown = !tripSelectionController.dropdownShown;
                break;
        }
    }
</script>
{#if actionController.currAction === "queryableSearch" && scheduleSearchController.filteredQueryables.length > 0}
    <div class="flex justify-center items-center h-auto w-full bg-transparent">
        <button id="expand-btn" aria-label="{scheduleSearchController.dropdownShown ? 'bezár' : 'kinyit'}"
            class="group relative -top-1.5 h-6 w-8 bg-white rounded-b-sm transition-all duration-150 hover:top-0 hover:cursor-pointer pointer-events-auto"
            onclick={onclick} onkeydown={() => {}}>
            <svg style="rotate: {scheduleSearchController.dropdownShown ? '180deg' : '0deg'}"
                xmlns="http://www.w3.org/2000/svg" class="relative -top-[10%] p-1 w-full aspect-1/1 transition-all duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <polyline points="6 7 12 13 18 7" />
                <polyline points="6 12 12 18 18 12" />
            </svg>
        </button>
    </div>
{:else if actionController.currAction === "tripSelection" && tripSelectionController.trips.length > 0}
    <div class="flex justify-center items-center h-auto w-full bg-transparent">
        <div id="expand-btn" role="button" tabindex="-1"
            class="group relative -top-1.5 h-6 w-8 bg-white rounded-b-sm transition-all duration-150 hover:top-0 hover:cursor-pointer pointer-events-auto"
            onclick={onclick} onkeydown={() => {}}>
            <svg style="rotate: {tripSelectionController.dropdownShown ? '180deg' : '0deg'}"
                xmlns="http://www.w3.org/2000/svg" class="relative -top-[10%] p-1 w-full aspect-1/1 transition-all duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <polyline points="6 7 12 13 18 7" />
                <polyline points="6 12 12 18 18 12" />
            </svg>
        </div>
    </div>
{/if}