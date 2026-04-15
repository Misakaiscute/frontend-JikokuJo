<script lang="ts">
    import ScheduleSearchController from "../../scheduleSearchController.svelte.ts";
    import DatePicker from "./DatePicker.svelte";
    import TimePicker from "./TimePicker.svelte";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();

    const onDatePickerClick = () => {
        if (scheduleSearchController.dateTimePickerDropdown !== "date"){
            scheduleSearchController.dateTimePickerDropdown = "date";
        } else {
            scheduleSearchController.dateTimePickerDropdown = null
        }
    }
    const onTimePickerClick = () => {
        if (scheduleSearchController.dateTimePickerDropdown !== "time"){
            scheduleSearchController.dateTimePickerDropdown = "time";
        } else {
            scheduleSearchController.dateTimePickerDropdown = null
        }
    }
</script>

<div id="datetime-picker" class="flex-[0_0_auto] w-full flex flex-col items-center justify-center">
    <div class="flex-[0_0_1rem] w-full flex justify-center items-center mt-1 bg-zinc-200
        rounded-t-sm {scheduleSearchController.dateTimePickerDropdown === null ? 'rounded-b-sm' : ''}"
    >
        <div class="h-[90%] mx-3 flex items-center justify-center">
            <p class="flex-[1_1_auto]">Indulás:</p>
        </div>
        <div id="date-btn" role="button" tabindex="0"
            class="noselect flex-[3_0_auto] h-[90%] mx-0.5 flex items-center justify-center rounded-sm bg-white
                   border-2 border-white hover:border-zinc-800 hover:cursor-pointer transition-colors duration-200"
            onclick={onDatePickerClick} onkeydown={() => {}}
        >
            <p>{scheduleSearchController.date.toLocaleDateString('hu-HU')}</p>
        </div>
        <div id="time-btn" role="button" tabindex="0"
             class="flex-[3_0_auto] h-[90%] mx-0.5 flex items-center justify-center rounded-sm bg-white
                   border-2 border-white hover:border-zinc-800 hover:cursor-pointer transition-colors duration-200"
             onclick={onTimePickerClick} onkeydown={() => {}}
        >
            <p>{scheduleSearchController.date.toLocaleTimeString('hu-HU', {hour: "2-digit", minute: "2-digit"})}</p>
        </div>
    </div>
    {#if scheduleSearchController.dateTimePickerDropdown === "date"}
        <DatePicker/>
    {:else if scheduleSearchController.dateTimePickerDropdown === "time"}
        <TimePicker/>
    {/if}
</div>