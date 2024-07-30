import express from "express";
const app = express();
import gitRoute from './gitRoute.js'
import epicRoute from './epicRoute.js'
import organisationRoute from './organisationRoute.js'
import ticketRoute from "./ticketRoute.js";
import actionRoute from "./actionRoute.js";
import prRoute from "./prRoute.js";

app.use(`/git`, gitRoute );
app.use(`/organisations`, organisationRoute );
app.use(`/epics`, epicRoute );
app.use(`/tickets`, ticketRoute );
app.use(`/prs`, prRoute );
app.use(`/actions`, actionRoute );

export default app;