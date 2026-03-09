<script lang="ts">
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();
</script>
{#if scheduleSearchController.filteredQueryables.length > 0}
    <div class="flex justify-center items-center h-auto w-full bg-transparent">
        <button
            aria-label="{scheduleSearchController.dropdownShown ? 'bezár' : 'kinyit'}"
            class="group relative -top-1.5 h-6 w-8 bg-white rounded-b-sm transition-all duration-150 hover:top-0 hover:cursor-pointer"
            onclick="{() => {scheduleSearchController.dropdownShown = !scheduleSearchController.dropdownShown}}"
        >
            <svg
                style="rotate: {scheduleSearchController.dropdownShown ? '180deg' : '0deg'}"
                xmlns="http://www.w3.org/2000/svg" class="relative -top-[10%] p-1 w-full aspect-1/1 transition-all duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            >
                <polyline points="6 7 12 13 18 7" />
                <polyline points="6 12 12 18 18 12" />
            </svg>
        </button>
    </div>
{/if}