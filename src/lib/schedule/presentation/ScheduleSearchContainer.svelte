<script lang="ts">
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";
    import SearchBar from "./SearchBar.svelte";
    import DateTimeSelector from "./DateTimeSelector.svelte";
    import QueryableDropdown from "./QueryableDropdown.svelte";

    ScheduleSearchController.setScheduleSearchControllerContext();
</script>
<div class="z-[1] absolute top-3 left-12 w-80 h-auto p-1 flex flex-col justify-center rounded-md bg-white">
    <SearchBar/>
    <DateTimeSelector/>
    <QueryableDropdown/>
</div>