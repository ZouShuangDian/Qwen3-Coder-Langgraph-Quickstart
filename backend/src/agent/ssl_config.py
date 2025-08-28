"""
SSL Configuration for Windows Environment
Handles SSL certificate verification issues commonly encountered on Windows systems.
"""
import os
import ssl
import certifi
import urllib3
import warnings
from typing import Optional


class SSLConfig:
    """SSL configuration manager for handling certificate verification."""
    
    def __init__(self):
        self.ssl_context = self._create_ssl_context()
        self._configure_urllib3()
    
    def _create_ssl_context(self) -> ssl.SSLContext:
        """Create SSL context with proper certificate verification."""
        try:
            # Use certifi's certificate bundle
            context = ssl.create_default_context(cafile=certifi.where())
            context.check_hostname = True
            context.verify_mode = ssl.CERT_REQUIRED
            
            # For development environments, you might need to be more lenient
            if os.getenv("SSL_VERIFY", "true").lower() == "false":
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE
                warnings.warn(
                    "SSL verification is disabled. This is not recommended for production.",
                    UserWarning
                )
            
            return context
        except Exception as e:
            print(f"Warning: Failed to create SSL context: {e}")
            # Fallback to default context
            return ssl.create_default_context()
    
    def _configure_urllib3(self):
        """Configure urllib3 to handle SSL properly."""
        # Disable only the specific warnings we expect
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        
        # Set SSL context globally if needed
        if os.getenv("SSL_VERIFY", "true").lower() == "false":
            urllib3.disable_warnings()
    
    def get_ssl_context(self) -> ssl.SSLContext:
        """Get the configured SSL context."""
        return self.ssl_context
    
    def get_ca_bundle_path(self) -> str:
        """Get the path to the CA bundle."""
        return certifi.where()


# Global SSL configuration instance
ssl_config = SSLConfig()


def get_ssl_context() -> ssl.SSLContext:
    """Get the global SSL context."""
    return ssl_config.get_ssl_context()


def get_ca_bundle_path() -> str:
    """Get the path to the CA certificate bundle."""
    return ssl_config.get_ca_bundle_path()


def configure_environment_ssl():
    """Configure environment variables for SSL."""
    # Set SSL certificate file path
    os.environ["SSL_CERT_FILE"] = certifi.where()
    os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()
    
    # For httpx
    os.environ["HTTPX_LOG_LEVEL"] = "WARNING"


# Initialize SSL configuration when module is imported
configure_environment_ssl()