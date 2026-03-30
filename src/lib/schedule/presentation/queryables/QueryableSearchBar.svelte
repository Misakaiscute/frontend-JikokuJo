<script lang="ts">
    import ScheduleSearchController from "../scheduleSearchController.svelte.ts";
    import ActionController from "../actionController.svelte.ts";
    import TripSelectionController from "../tripSelectionController.svelte.ts";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();
    const tripSelectionController: TripSelectionController = TripSelectionController.getTripSelectionControllerContext();
    const actionController: ActionController = ActionController.getActionControllerContext();

    let trailingActionClear: boolean = $derived(scheduleSearchController.selectedQueryable === null && scheduleSearchController.searchString !== "");
    let trailingActionSearch: boolean = $derived(scheduleSearchController.selectedQueryable !== null);
</script>
{#await scheduleSearchController.queryablesFetchRequestResult}
    <div class="group flex h-10 w-full items-center rounded-md loading-shimmer"></div>
{:then _}
    <div class="group flex h-10 w-full items-center rounded-md border-2 border-zinc-200 bg-white focus-within:border-zinc-800 transition-colors duration-300">
        <input
            id="search-bar" type="text" placeholder="Megálló / járat" autocomplete="off"
            class="flex-[1_0_auto] bg-transparent py-4 pl-2 text-sm text-zinc-800 placeholder-zinc-400 outline-none"
            bind:value={scheduleSearchController.searchString}
        />
        {#if trailingActionSearch}
            <button
                aria-label="search-button"
                class="mr-2 h-[70%] flex-none text-zinc-400 hover:transition-colors duration-200 hover:cursor-pointer hover:text-zinc-600"
                onclick={() => {
                    scheduleSearchController.dropdownShown = false;
                    actionController.currAction = 'tripSelection';
                    tripSelectionController.searchTrips(scheduleSearchController.selectedQueryable!!, scheduleSearchController.date);
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" class="aspect-1/1 h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
            </button>
        {:else if trailingActionClear}
            <button
                aria-label="search-button"
                class="mr-2 h-[70%] flex-none text-zinc-400 hover:transition-colors duration-200 hover:cursor-pointer hover:text-zinc-600"
                onclick={() => { scheduleSearchController.searchString = ''; }}>
                <svg xmlns="http://www.w3.org/2000/svg" class="aspect-1/1 h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V3h6v3" />
                </svg>
            </button>
        {/if}
    </div>
{:catch error}
    <div class="group flex h-10 w-full items-center rounded-md border-2 border-zinc-200 bg-white focus-within:border-zinc-800 transition-colors duration-300">
        <p id="search-bar" class="flex-[1_0_auto] bg-transparent py-4 pl-2 text-sm text-red-800 outline-none">
            {error.message}
        </p>
        <button
            aria-label="search-button"
            class="mr-2 h-[70%] flex-none text-zinc-400 hover:transition-colors duration-200 hover:cursor-pointer hover:text-zinc-600"
            onclick={() => { scheduleSearchController.fetchQueryables(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" class="aspect-1/1 h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path d="M3 4v6h6" />
                <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
            </svg>
        </button>
    </div>
{/await}