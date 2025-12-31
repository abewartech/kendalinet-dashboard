#!/bin/sh
echo "Content-Type: application/json"
echo ""

VERSION="$(. /etc/openwrt_release && echo "$DISTRIB_RELEASE")"
KERNEL="$(uname -r)"

cat <<EOF
{
  "currentVersion": "$VERSION",
  "kernel": "$KERNEL"
}
EOF
