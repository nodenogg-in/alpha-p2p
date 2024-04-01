---
title: Data
description: Where does nodenogg.in store its data?
---
:::caution
TLDR: In the current implementation, data lives entirely locally in each person's browser storage. Because nodenogg.in is peer to peer (P2P), that data is shared and distributed to others, so everyone else has a copy of your data.

This also means that for now, your data is attached to a key which is your only way of proving that you are the owner and author.
:::

## The vision for decentralised data storage

In nodenogg.in, the broad vision is to build a completely decentralised system where people own and store their data. You could describe this approach as local-first, and is best summarised in [this Ink & Switch article](https://www.inkandswitch.com/local-first/) approach:

> We believe that data ownership and real-time collaboration are not at odds with each other. It is possible to create software that has all the advantages of cloud apps, while also allowing you to retain full ownership of the data, documents and files you create.
> We call this type of software local-first software, since it prioritizes the use of local storage (the disk built into your computer) and local networks (such as your home WiFi) over servers in remote datacenters.

This comes with benefits but also comes with potentially serious downsides. This means that we want to help people understand how to look after their data so they can trust nodenogg.in in the same way they can trust Google Drive or Microsoft Word.


### Benefits
* Data is shared on user's own terms and is only available within trusted networks.
* Data is not dependent on a remote server.
* No sign-in, SSO, authentication or other distractions get in the way.

### Risks
* Someone's stored data is dependent on access to a particular browser installation (they might not have synced with any other peers and therefore have no other copies of their data). 
* Safari imposes a [7-day cap on browser storage APIs](https://webkit.org/tracking-prevention/). 
* People might change their machine or switch/reinstall their browser without realising.
* People often have expectations set by the user experience of Google Drive, and be put off by having to think differently about their data.

