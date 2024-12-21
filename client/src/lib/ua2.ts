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
    series: string | null; // Series for OS like Windows 10, macOS Monterey
  };
  device: {
    model: string | null;
    type: string | null;
    vendor: string | null;
    series: string | null; // Series for devices like iPhone 14, Galaxy S21
  };
  cpu: {
    architecture: string | null;
  };
}

export function parseUserAgent(userAgent: string): UserAgentDetails {
  const browserRegex = /(Chrome|Firefox|Safari|Edge|Opera|MSIE|Trident)[\/ ]([\d.]+)/i;
  const engineRegex = /(Blink|WebKit|Gecko|Trident)[\/ ]?([\d.]*)/i;
  const osRegex = /(Windows NT|Mac OS X|Linux|Android|iOS|Ubuntu|Chrome OS|Windows 10|macOS Monterey|macOS Ventura)[; ]?([\d._]*)/i;
  const deviceRegex = /(iPhone|iPad|iPod|Android|Windows Phone|BlackBerry|webOS|Macintosh|PC|Galaxy [^;]+)/i;
  const vendorRegex = /(Apple|Samsung|Google|Huawei|Xiaomi|Sony|LG|Microsoft|Lenovo|HP)/i;
  const cpuRegex = /(arm|x86_64|x64|i386|amd64|arm64)/i;

  const browserMatch = userAgent.match(browserRegex);
  const engineMatch = userAgent.match(engineRegex);
  const osMatch = userAgent.match(osRegex);
  const deviceMatch = userAgent.match(deviceRegex);
  const vendorMatch = userAgent.match(vendorRegex);
  const cpuMatch = userAgent.match(cpuRegex);

  // Improved series detection for OS
  let osSeries: string | null = null;
  if (osMatch) {
    if (osMatch[1].includes("Windows NT")) {
      const versionMap: { [key: string]: string } = {
        "10.0": "Windows 10",
        "6.3": "Windows 8.1",
        "6.2": "Windows 8",
        "6.1": "Windows 7",
        "5.1": "Windows XP",
      };
      osSeries = versionMap[osMatch[2]] || null;
    } else if (osMatch[1].includes("Mac OS X")) {
      osSeries = osMatch[1].replace("Mac OS X", "macOS");
    } else {
      osSeries = osMatch[1];
    }
  }

  // Custom logic to determine "series" for devices (e.g., iPhone series or other devices)
  let deviceSeries: string | null = null;
  if (deviceMatch) {
    const seriesMatch = deviceMatch[0].match(/(iPhone|Galaxy\s[^;]+)/);
    deviceSeries = seriesMatch ? seriesMatch[0] : null;
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
      version: osMatch ? osMatch[2].replace(/_/g, '.') : null,
      series: osSeries,
    },
    device: {
      model: deviceMatch ? deviceMatch[0] : null,
      type: deviceMatch ? (deviceMatch[0] === "Macintosh" || deviceMatch[0] === "PC" ? "desktop" : "mobile") : null,
      vendor: vendorMatch ? vendorMatch[1] : null,
      series: deviceSeries,
    },
    cpu: {
      architecture: cpuMatch ? cpuMatch[1] : null,
    },
  };
}