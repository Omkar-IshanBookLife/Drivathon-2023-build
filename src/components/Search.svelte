<script lang="ts">
    import { onMount } from "svelte";
    import { pb } from "../pocketbase";
    import type { Campaign } from "../types";
    import Loader from "./Loader.svelte";

    export let search = "";

    let drives: Campaign[];

    onMount(async () => {
        drives = await pb.collection("campaigns").getFullList<Campaign>({
            sort: "-created",
            expand: "createdUser",
            filter: `title~"${search}"`,
        });
    });
</script>

<main>
    {#if drives}
        {#if drives.length === 0}
            <div class="text-center">
                <div>
                    <h3>No Results Found For {search}</h3>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error ut sed mollitia. Voluptatum reiciendis rem quia quisquam odit pariatur placeat aut quos. Repellat quia assumenda aut est ea aspernatur pariatur.</p>
                </div><hr>
                <small>Please Check Out The Drives at the <a href="/drives">Drives Page</a>.</small>
            </div>
        {:else}
            <h3>Search Results for: {search}</h3>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Aspernatur maiores recusandae iure, praesentium molestias, culpa
                et obcaecati excepturi deleniti enim voluptas reiciendis,
                temporibus cupiditate. Laboriosam assumenda sint quas itaque
                eveniet.
            </p>
            <hr />
            <div id="drives">
                {#each drives as drive}
                    <div class="card vw-50 mb-4">
                        <img
                            src="https://drivathon.pockethost.io/api/files/campaigns/{drive.id}/{drive.image}"
                            class="card-img-top img-fluid"
                            alt="tweet-img"
                        />
                        <div class="card-body">
                            <h5>{drive.title}</h5>
                            <p>
                                {@html drive.description.slice(0, 600) + "..."}
                            </p>
                            <p>Posted by, {drive.expand.createdUser.name}</p>
                            <div class="btn-group">
                                <a
                                    class="btn btn-primary"
                                    href="/drive/{drive.id}">Details</a
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
                                posted on {new Date(
                                    drive.created
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {:else}
        <Loader />
    {/if}
</main>
