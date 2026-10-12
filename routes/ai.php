<?php

use App\Mcp\Servers\TaskManagerServer;
use Laravel\Mcp\Facades\Mcp;

Mcp::oauthRoutes();

Mcp::web('/mcp/tasks', TaskManagerServer::class)
    ->middleware(['auth:api', 'throttle:mcp'])
    ->name('mcp.tasks');
