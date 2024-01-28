# State machine for Spatial view

## Tool modes
* `select` select one or more items with click events, move canvas with trackpad/wheel
* `move` move the canvas with trackpad + click events, zoom with trackpad/wheel
* `newNode` similar to select but click creates a new node of default size, click and drag creates a sized node, move canvas with trackpad/wheel
* `connect` draw connections between nodes, move canvas with trackpad/wheel
* `edit` [invisible to user] when a node is focussed and being edited

## Selection data
Each of the events have interaction data available to them
* `area: Box | undefined` is the 2D area if the user has dragged a selection box. This is used either by the `select` to select a group of nodes or by the `newNode` mode to optionally draw the exact dimensions of their new node.
* `target: string | null` is the top-most node that the user is pointing at


## States
* `select` is the default state
* transitioning in between states resets selection data
