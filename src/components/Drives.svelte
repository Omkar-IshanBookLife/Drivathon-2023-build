<script lang="ts">
    import { onMount } from "svelte";
    import { pb } from "../pocketbase";
    import type { Campaign } from "../types";
    import Loader from "./Loader.svelte";
    import type { ListResult } from "pocketbase";

    let drives: Campaign[];
    let drivesData: ListResult<Campaign>;
    let page: number = 1;
    let pages: number[] = [1]

    let box: HTMLDivElement;

    let sortOption = "-created";

    onMount(async () => {
        drivesData = await pb
            .collection("campaigns")
            .getList<Campaign>(page, 5, {
                sort: sortOption,
                expand: "createdUser",
            });
        drives = drivesData.items;
        for (let i = 1; i <= drivesData.totalPages; i++) {
            pages[i-1] = i
        }
    });

    let sortDrives = async () => {
        drives = null;
        drives = await pb
            .collection("campaigns")
            .getFullList<Campaign>({ sort: sortOption, expand: "createdUser" });
    };

    let pageDrives = async (page_number: number) => {
        drivesData = await pb
            .collection("campaigns")
            .getList<Campaign>(page_number, 5, {
                sort: sortOption,
                expand: "createdUser",
            });
        drives = drivesData.items;
		box.scrollIntoView();
    }
</script>

<main>
    <h3 bind:this={box}>All Campaigns or Drives to Join</h3>
    <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
        explicabo sunt repellendus laborum architecto perspiciatis omnis, odio
        voluptatibus sequi culpa, iste, molestiae ea praesentium.
    </p>
    <div
        class="d-flex align-items-center justify-content-end"
        style="text-align: right;"
    >
        <div class="flex-grow-1 w-100" />
        <select
            class="form-select w-25"
            aria-label="Default select example"
            bind:value={sortOption}
            on:change={sortDrives}
        >
            <option selected disabled>Sort By</option>
            <option value="-created">Latest Created</option>
            <option value="+created">Oldest Created</option>
            <option value="-updated">Latest Updated</option>
            <option value="+updated">Oldest Updated</option>
        </select>
    </div>
    <hr />
    <div id="drives" >
        {#if drives}
            {#each drives as drive}
                <div class="card min-vw-25 mb-4">
                    <img
                        src="https://drivathon.pockethost.io/api/files/campaigns/{drive.id}/{drive.image}"
                        class="card-img-top img-fluid w-50-sm"
                        alt="tweet-img"
                    />
                    <div class="card-body">
                        <h5>{drive.title}</h5>
                        <p>
                            {@html drive.description.slice(0, 300) + "..."}
                        </p>
                        <p>Posted by, {drive.expand.createdUser.name}</p>
                        <div class="btn-group">
                            <a class="btn btn-primary" href="/drive/{drive.id}"
                                >Details</a
                            ><a
                                class="btn btn-secondary"
                                href={drive.map}
                                target="_blank"
                                rel="noreferrer">Map</a
                            >
                        </div>
                    </div>
                    <div class="card-footer">
                        <p class="text-muted">
                            posted on {new Date(drive.created).toLocaleString()}
                        </p>
                    </div>
                </div>
            {/each}
            {#if drivesData.page !== 0}
                <nav
                    aria-label="Page navigation example"
                    class="d-flex align-items-center justify-content-center"
                >
                    <ul class="pagination">
                        <li class="page-item">
                            <button class="page-link p-2"><span aria-hidden="true">&laquo;</span></button>
                        </li>   
                        {#each pages as page_number}
                            <li class="page-item">
                                <button class="page-link p-2" on:click={() => pageDrives(page_number)}>{page_number}</button>
                            </li>                            
                        {/each}
                        <li class="page-item">
                            <button class="page-link p-2"><span aria-hidden="true">&raquo;</span></button>
                        </li> 
                    </ul>
                </nav>
            {/if}
        {:else}
            <Loader />
        {/if}
    </div>
</main>
