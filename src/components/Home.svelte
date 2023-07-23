<script lang="ts">
    import { onMount } from "svelte";
    import { pb, currentUser } from "../pocketbase";
    import type { Campaign } from "../types";
    import Loader from "./Loader.svelte";

    let latestDrive: Campaign;
    let description = "";

    onMount(async () => {
        latestDrive = await pb
            .collection("campaigns")
            .getFirstListItem<Campaign>("", {
                sort: "-created",
                expand: "createdUser",
            });
        description = latestDrive.description.slice(0, 600) + "...";
    });
</script>

<main>
    {#if latestDrive}
        <div id="home">
            {#if $currentUser}
                <h1>Welcome back, {$currentUser.name}👋</h1>
            {:else}
                <h1>Welcome to Drivathon 🍃</h1>
            {/if}
            <p class="text-muted">
                A place to stop typing and start campaigning.
            </p>
            <a href="/drives">Get Started</a>
        </div>
        <hr />
        <div id="history">
            <h3>History of Drivathon</h3>
            <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Deleniti odio enim cum recusandae eum, vero, impedit labore in
                nihil qui quisquam error excepturi sunt atque animi aspernatur
                deserunt voluptatum. Praesentium?Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Cumque itaque quibusdam iusto
                neque libero cupiditate, dicta, voluptatibus harum quo facilis
                delectus labore mollitia asperiores deserunt atque a quod
                repellat adipisci.
            </p>
        </div>
        <hr />
        <div id="latestDrive">
            <div class="card vw-50">
                <div class="card-header"><h5>Latest</h5></div>
                <img
                    src="https://drivathon.pockethost.io/api/files/campaigns/{latestDrive.id}/{latestDrive.image}"
                    class="card-img-top img-fluid"
                    alt="tweet-img"
                />
                <div class="card-body">
                    <h5>{latestDrive.title}</h5>
                    <p>
                        {@html description}
                    </p>
                    <p>Posted by, {latestDrive.expand.createdUser.name}</p>
                    <div class="btn-group">
                        <a
                            class="btn btn-primary"
                            href="/drive/{latestDrive.id}">Details</a
                        ><a
                            class="btn btn-secondary"
                            href={latestDrive.map}
                            target="_blank"
                            rel="noreferrer">Map</a
                        >
                    </div>
                </div>
                <div class="card-footer">
                    <p class="text-muted">
                        posted on {new Date(latestDrive.created).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    {:else}
        <Loader/>
    {/if}
</main>
