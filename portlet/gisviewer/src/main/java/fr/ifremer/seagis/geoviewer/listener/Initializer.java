package fr.ifremer.seagis.geoviewer.listener;

import javax.servlet.ServletContextEvent;

import com.liferay.portal.kernel.servlet.PortletContextListener;
import javax.imageio.ImageIO;
import org.geotoolkit.lang.Setup;

/**
 * This class is used to initialize Geotoolkit Setup.
 * 
 * @author Fabien BERNARD (Geomatys)
 */
public class Initializer extends PortletContextListener {

    @Override
    public synchronized void contextInitialized(ServletContextEvent sce) {
        Setup.initialize(null);      
        ImageIO.scanForPlugins();
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        super.contextDestroyed(sce);
    }
    
}