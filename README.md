# Simple DDNS Client
Very simple Dynamic DNS (DDNS) client for node, because pointing DNS `A` records at dynamic IPs should not be such a headache in 2023.  Of the DDNS services out there, most require a fee or some annoying manual process every 30 days to keep the free account active.

If you're anything like me, you're almost always running a million pet projects with small embedded devices placed all over the home and producing data that needs to be consumed by outside services.  A DDNS client is perfect for this, allowing for example, a [graph](https://observablehq.com/d/59f802926733fc0e) from ObservableHQ with the latest data from a device regardless of whether my ISP decided to change my IP address.  Moreover, I tend to bounce around different infrastructure providers (Digital Ocean, AWS, Vercel, etc.) and got tired of constantly figuring out and installing a new script/cli to expose my devices to those services.

## What's it do?
When run, this client retrieves the device's external IP address, and sends an API request to update the `A` record on your DNS provider for that device. That's it. Hurray!

I recently switched to Porkbun for my domain names, so I wrote this for now, with the expectation that I'll need to add additional providers in the future, when I inevitably switch services yet again.


# Important Note!
While you're welcome to use, adapt, and submit pull requests, I wrote this for myself.  Don't let the beautiful README fool you -- I love writing detailed docs because I have scripts that have been chugging along untouched since 1998, and therefore have personal experience with how reading code you wrote 25 years ago as a teenager is just as difficult as understanding why JNCO was a thing.

## Installation from source:
1. Clone the repo: `git clone git@github.com:chieffancypants/ddns-client.git`
1. Install dependencies: `npm install`
1. Compile typescript: `npm run build`
1. Create `.env` using `.env.template` as a guide
1. Schedule in cron.  I use every 2 hours: `0 */2 * * * /path/to/ddns-client/scripts/cron-ddns.sh`

## Installation from pre-built release:
1. Download the `ddns-client.zip` from the [latest release](https://github.com/chieffancypants/ddns-client/releases) to your device
1. `unzip dns-client.zip -d ./dns-client`
1. Create `.env` using `.env.template` as a guide
1. Schedule in cron.  I use every 2 hours: `0 */2 * * * /path/to/ddns-client/scripts/cron-ddns.sh`

## Upgrading:
A provided script makes this pretty easy: `$ scripts/update.sh`

## Usage:
Rename `.env.template` to `.env` and change it to reflect the details of each device this runs on. For example, if you want to point to a new device that monitors your beer hydrometer levels.  `HOSTNAME` is the `A` record created or updated.  In the following example, the DDNS entry pointing to your dynamic IP will be `beer-fermentation.wescruver.com`

```js
API_KEY="pk1_..."
API_SECRET="sk1_..."
DOMAIN="wescruver.com"
HOSTNAME="beer-fermentation"
PROVIDER="porkbun"
```
