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
    type: "Mobile" | "Desktop" | "Tablet" | null;
    vendor: string | null;
    series: string | null; // Series for devices like iPhone 14, Galaxy S21
  };
  cpu: {
    architecture: string | null;
  };
  isMobile: boolean;
  isDesktop: boolean;
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

  // Detect OS series
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
      const macVersion = osMatch[2]?.replace(/_/g, ".") || "";
      osSeries = `macOS ${macVersion}`; // Example: macOS 12.5
    } else if (osMatch[1] === "iOS") {
      const iosVersion = osMatch[2]?.replace(/_/g, ".") || "";
      osSeries = `iOS ${iosVersion}`; // Example: iOS 16.2
    } else {
      osSeries = osMatch[1];
    }
  }

  // Detect device series
  let deviceSeries: string | null = null;
  if (deviceMatch) {
    if (/iPhone/.test(deviceMatch[0])) {
      deviceSeries = "iPhone"; // Could expand this to include model detection
    } else if (/Galaxy/.test(deviceMatch[0])) {
      const galaxyMatch = deviceMatch[0].match(/Galaxy [^;]+/);
      deviceSeries = galaxyMatch ? galaxyMatch[0] : "Galaxy";
    } else if (/iPad|iPod/.test(deviceMatch[0])) {
      deviceSeries = deviceMatch[0]; // iPad or iPod directly
    } else {
      deviceSeries = deviceMatch[0];
    }
  }

  // Determine device type (mobile, desktop, tablet)
  let deviceType: "Mobile" | "Desktop" | "Tablet" | null = null;
  const isMobile =
    /iPhone|Android|Windows Phone|webOS|BlackBerry/i.test(userAgent);
  const isTablet = /iPad/i.test(userAgent);
  const isDesktop =
    !isMobile && !isTablet && /Macintosh|PC|Windows NT|Linux|Chrome OS/i.test(userAgent);

  if (isMobile) {
    deviceType = "Mobile";
  } else if (isTablet) {
    deviceType = "Tablet";
  } else if (isDesktop) {
    deviceType = "Desktop";
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
      series: osSeries,
    },
    device: {
      model: deviceMatch ? deviceMatch[0] : null,
      type: deviceType,
      vendor: vendorMatch ? vendorMatch[1] : null,
      series: deviceSeries,
    },
    cpu: {
      architecture: cpuMatch ? cpuMatch[1] : null,
    },
    isMobile,
    isDesktop,
  };
}

