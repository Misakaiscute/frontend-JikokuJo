<script lang="ts">
    import {slide} from "svelte/transition";
    import ScheduleSearchController from "../../scheduleSearchController.svelte.ts";
    import {dateHelpers} from "../../../utils/dateHelpers.ts";
    import {timeFormatter} from "../../../../core/utils/timeFormatter.ts";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();

    const TIME_STEP_MINS: number = 15;
    const availableTimeMins: number[] = [];
    if (dateHelpers(scheduleSearchController.date).sameDayAs(Date.now())){
        for (let i = dateHelpers(Date.now()).dayInMinutes(); i < 24 * 60; i++){
            if (i % TIME_STEP_MINS === 0) availableTimeMins.push(i);
        }
    } else {
        for (let i = 0; i < 24 * 60; i++){
            if (i % TIME_STEP_MINS === 0) availableTimeMins.push(i);
        }
    }

    const onClose = () => { scheduleSearchController.dateTimePickerDropdown = null; };
    const onSetTime = (timeMin: number) => {
        const newTime = new Date();
        newTime.setHours(timeMin / 60, timeMin % 60, 0, 0);
        newTime.setFullYear(
            scheduleSearchController.date.getFullYear(),
            scheduleSearchController.date.getMonth(),
            scheduleSearchController.date.getDate()
        );
        scheduleSearchController.date = newTime;

        onClose();
    }
    const onSetNow = () => {
        if (dateHelpers(Date.now()).isPastDay(scheduleSearchController.date)) {
            scheduleSearchController.date = new Date(Date.now());
        }
        onSetTime(dateHelpers(Date.now()).dayInMinutes());
    }
</script>

{#snippet timeSelectorButton(timeMin: number)}
    <div id="time-selector-item" role="button" tabindex="0"
        class="flex-[1_1_24%] h-8 flex justify-center items-center bg-white border-2 border-white rounded-sm
               hover:border-zinc-800 transition-colors duration-200 hover:cursor-pointer"
        onclick={() => onSetTime(timeMin)} onkeydown={() => {}}
    >
        <p class="text-sm">{timeFormatter(timeMin)}</p>
    </div>
{/snippet}

<div in:slide={{ duration: 200, delay: 150 }} out:slide={{ duration: 100 }}
     class="flex-[0_0_auto] w-full flex items-center justify-center bg-zinc-200 rounded-b-sm"
>
    <div id="time-selectors" class="flex-[1_1_auto] h-auto max-h-[6.25rem] ml-0.5 my-0.5 flex flex-wrap gap-0.5 justify-start items-start overflow-y-scroll disable-scrollbars">
        {#each availableTimeMins as timeMin}
            {@render timeSelectorButton(timeMin)}
        {/each}
    </div>
    <div class="flex-[0_0_auto] h-full mx-0.5 py-0.5 flex flex-col gap-y-0.5 items-center justify-center">
        <div id="done-btn" role="button" tabindex="0"
            class="flex-[1_1_auto] w-full flex justify-center items-center bg-white border-2 border-transparent rounded-sm
                  transition-colors duration-200 hover:border-zinc-800 hover:cursor-pointer"
            onclick={onClose} onkeydown={() => {}}
        >
            <p class="flex-[1_1_auto] px-1 text-sm text-center">Kész</p>
        </div>
        <div id="set-current-btn" role="button" tabindex="0"
            class="flex-[1_1_auto] w-full flex justify-center items-center bg-white border-2 border-transparent rounded-sm
                  transition-colors duration-200 hover:border-zinc-800 hover:cursor-pointer"
            onclick={onSetNow} onkeydown={() => {}}
        >
            <p class="flex-[1_1_auto] px-1 text-sm text-center">Most</p>
        </div>
    </div>
</div>