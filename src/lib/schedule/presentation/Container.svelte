<script lang="ts">
    import { slide } from "svelte/transition";
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";
    import SearchBar from "./queryables/SearchBar.svelte";
    import DateTimeSelector from "./queryables/DateTimeSelector.svelte";
    import Dropdown from "./queryables/Dropdown.svelte";
    import DropdownExpanderArrow from "./DropdownExpanderArrow.svelte";
    import NavigationContainer from "./NavigationContainer.svelte";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.setScheduleSearchControllerContext();
</script>
<div class="absolute left-0 top-0 p-2 flex">
    <div class="min-w-80 w-[50svw] max-w-[450px] h-auto flex flex-col max-[460px]:w-full max-[460px]:min-w-60">
        {#if scheduleSearchController.searchState === "queryable_search"}
            <div out:slide={{ duration: 200 }} class="z-[2] h-full w-full p-1 flex flex-col justify-center rounded-md bg-white">
                <SearchBar/>
                <DateTimeSelector/>
                <Dropdown/>
            </div>
            <div out:slide={{ duration: 200 }} class="z-[1] h-full w-full">
                <DropdownExpanderArrow/>
            </div>
        {/if}
    </div>
    <nav class="ml-1 w-auto h-auto">
        <NavigationContainer/>
    </nav>
</div>