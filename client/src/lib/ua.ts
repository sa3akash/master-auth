interface UserAgentDetails {
  browser: {
    name: string | null;
    version: string | null;
  };
  engine: {
    name: string | null;
    version: string | null;
  };
  os: {
    name: string | null;
    version: string | null;
  };
  device: {
    model: string | null;
    type: string | null;
    vendor: string | null;
  };
  series: string | null;
  cpu: {
    architecture: string | null;
  };
}

export const parseUserAgent = (userAgent: string): UserAgentDetails => {
  const browserRegex =
    /(Chrome|Firefox|Safari|Edge|Opera|MSIE|Trident)[\/ ]([\d.]+)/i;
  const engineRegex = /(Blink|WebKit|Gecko|Trident)[\/ ]?([\d.]*)/i;
  const osRegex =
    /(Windows NT|Mac OS X|Linux|Android|iOS|Ubuntu|Chrome OS)[; ]?([\d._]*)/i;
  const deviceRegex =
    /(iPhone|iPad|iPod|Android|Windows Phone|BlackBerry|webOS|Macintosh|PC)/i;
  const vendorRegex =
    /(Apple|Samsung|Google|Huawei|Xiaomi|Sony|LG|Microsoft|Lenovo|HP)/i;
  const cpuRegex = /(arm|x86_64|x64|i386|amd64|arm64)/i;

  const browserMatch = userAgent.match(browserRegex);
  const engineMatch = userAgent.match(engineRegex);
  const osMatch = userAgent.match(osRegex);
  const deviceMatch = userAgent.match(deviceRegex);
  const vendorMatch = userAgent.match(vendorRegex);
  const cpuMatch = userAgent.match(cpuRegex);

  // Custom logic to determine "series" (e.g., iPhone series or other devices)
  let series: string | null = null;
  if (deviceMatch) {
    const modelMatch = deviceMatch[0].match(/(\w+\s?\d+)/);
    series = modelMatch ? modelMatch[1] : null;
  }

  return {
    browser: {
      name: browserMatch ? browserMatch[1] : null,
      version: browserMatch ? browserMatch[2] : null,
    },
    engine: {
      name: engineMatch ? engineMatch[1] : null,
      version: engineMatch ? engineMatch[2] || null : null,
    },
    os: {
      name: osMatch ? osMatch[1] : null,
      version: osMatch ? osMatch[2].replace(/_/g, ".") : null,
    },
    device: {
      model: deviceMatch ? deviceMatch[0] : null,
      type: deviceMatch
        ? deviceMatch[0] === "Macintosh" || deviceMatch[0] === "PC"
          ? "desktop"
          : "mobile"
        : null,
      vendor: vendorMatch ? vendorMatch[1] : null,
    },
    series,
    cpu: {
      architecture: cpuMatch ? cpuMatch[1] : null,
    },
  };
};
