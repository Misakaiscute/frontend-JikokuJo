<script lang="ts">
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";
    import SearchBar from "./SearchBar.svelte";
    import DateTimeSelector from "./DateTimeSelector.svelte";
    import QueryableDropdown from "./QueryableDropdown.svelte";
    import QueryableDropdownExpanderArrow from "./QueryableDropdownExpanderArrow.svelte";

    ScheduleSearchController.setScheduleSearchControllerContext();
</script>
<div class="absolute top-3 left-12 w-80 h-auto flex flex-col">
    <div class="z-[2] h-full w-full p-1 flex flex-col justify-center rounded-md bg-white">
        <SearchBar/>
        <DateTimeSelector/>
        <QueryableDropdown/>
    </div>
    <div class="z-[1] h-full w-full">
        <QueryableDropdownExpanderArrow/>
    </div>
</div>
