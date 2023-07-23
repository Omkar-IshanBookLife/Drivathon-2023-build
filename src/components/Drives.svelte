<script lang="ts">
    import { onMount } from "svelte";
    import { pb } from "../pocketbase";
    import type { Campaign } from "../types";
    import Loader from "./Loader.svelte";

    let drives: Campaign[];

    let sortOption = "-created";

    onMount(async () => {
        drives = await pb
            .collection("campaigns")
            .getFullList<Campaign>({ sort: sortOption, expand: "createdUser" });
    });

    let sortDrives = async () => {
        drives = null
        drives = await pb
            .collection("campaigns")
            .getFullList<Campaign>({ sort: sortOption, expand: "createdUser" });
    };
</script>

<main>
    <h3>All Campaigns or Drives to Join</h3>
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
            <option selected>Sort By</option>
            <option value="-created">Latest Created</option>
            <option value="+created">Oldest Created</option>
            <option value="-updated">Latest Updated</option>
            <option value="+updated">Oldest Updated</option>
        </select>
    </div>
    <hr />
    <div id="drives">
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
        {:else}
            <Loader/>
        {/if}
    </div>
</main>
