<script lang="ts">
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();
</script>
{#if scheduleSearchController.selectedQueryable !== null}
    {#if scheduleSearchController.selectedQueryable.kind === "stop"}
        <nav class="min-h-12 h-auto w-auto rounded-md py-2 px-0.5 border-2 flex flex-col items-center justify-center
                    bg-white border-zinc-200 transition-all duration-200 hover:border-zinc-800 hover:cursor-pointer">
            <button class="w-full text-sm [writing-mode:vertical-rl]">
                {scheduleSearchController.selectedQueryable.name}
            </button>
        </nav>
    {:else if scheduleSearchController.selectedQueryable.kind === "route"}
        <nav
            style="background: {scheduleSearchController.selectedQueryable.color ? '#' + scheduleSearchController.selectedQueryable.color : '#000000'}"
            class="min-h-12 h-auto w-auto rounded-md py-1 px-0.5 border-2 flex flex-col items-center justify-center
                  border-zinc-200 transition-all duration-200 hover:border-zinc-800 hover:cursor-pointer">
            <button class="w-full text-sm [writing-mode:vertical-rl]">
                {scheduleSearchController.selectedQueryable.route_short_name}
            </button>
        </nav>
    {/if}
{/if}