package si.fri.tpo.vmesniki_ws;

import java.util.List;
import javax.xml.ws.Response;
import si.fri.tpo.entitete.*;

public interface UporabnikREST {

	void createUporabnik(Uporabnik uporabnik);
	
	public List<Uporabnik> returnUporabniks();
	
	void deleteUporabnik(int id);
	
	void updateUporabnik(Uporabnik uporabnik);
	
	public Uporabnik returnUporabnik();
	
}