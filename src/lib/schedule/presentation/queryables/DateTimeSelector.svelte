<script lang="ts">
    import ScheduleSearchController from "../scheduleSearchController.svelte.ts";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();
</script>
<div class="flex justify-center items-center w-full h-6 mt-1 rounded-sm bg-zinc-200">
    <div class="h-[90%] my-0.5 mx-3 flex items-center bg-transparent">
        <p>Indulás:</p>
    </div>
    <div class="h-[90%] m-0.5 flex-[2_0_auto] flex items-center rounded-sm bg-white">
        <button id="set-date-btn" aria-label="date picker"
            class="w-full h-auto text-center rounded-sm outline-none hover:cursor-pointer"
            onclick="{() => {}}"
        >
            {scheduleSearchController.date.toLocaleDateString('hu-HU')}
        </button>
    </div>
    <div class="h-[90%] m-0.5 flex-[1_0_auto] flex items-center self-center rounded-sm bg-white">
        <button id="set-time-btn" aria-label="time picker"
            class="w-full h-auto text-center rounded-sm outline-none hover:cursor-pointer"
            onclick="{() => {}}"
        >
            {scheduleSearchController.date.toLocaleTimeString('hu-HU', {hour: "2-digit", minute: "2-digit"})}
        </button>
    </div>
</div>