package si.fri.tpo.zrna;

import java.util.List;

import javax.annotation.security.PermitAll;
import javax.ejb.Remove;
import javax.ejb.Stateless;
import javax.ejb.TransactionManagement;
import javax.ejb.TransactionManagementType;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import si.fri.tpo.entitete.ZdravstveniDelavec;
import si.fri.tpo.vmesnikiSB.ZdravstveniDelavecSBLocal;
import si.fri.tpo.vmesnikiSB.ZdravstveniDelavecSBRemote;

/**
 * Session Bean implementation class ZdravstveniDelavecSB
 */
@TransactionManagement(value=TransactionManagementType.CONTAINER)
@Stateless

public class ZdravstveniDelavecSB implements ZdravstveniDelavecSBRemote, ZdravstveniDelavecSBLocal {
	@PersistenceContext
	private EntityManager em;
    /**
     * Default constructor. 
     */
    public ZdravstveniDelavecSB() {
        
    }

    /*
     * (non-Javadoc)
     * @see si.fri.tpo.vmesnikiSB.ZdravstveniDelavecSBLocal#returnZdravstveniDelavec(int)
     */
	@Override
	public ZdravstveniDelavec returnZdravstveniDelavec(int id) {
		ZdravstveniDelavec zd = (ZdravstveniDelavec) em.createNamedQuery("ZdravstveniDelavec.findOne").setParameter("id", id).getSingleResult();

		//zd.setDelovniNalogs(null);

/*		try{
			zd.setDelovniNalogs(null);
			return zd;
		}catch(Exception e){}*/


		return zd;
	}
	
	/*
	 * (non-Javadoc)
	 * @see si.fri.tpo.vmesnikiSB.ZdravstveniDelavecSBLocal#deleteZdravstveniDelavec(int)
	 */
	@Override
	public void deleteZdravstveniDelavec(int id) {
		em.createNamedQuery("ZdravstveniDelavec.deleteOne").setParameter("id", id).executeUpdate();
		
	}
	/*
	 * (non-Javadoc)
	 * @see si.fri.tpo.vmesnikiSB.ZdravstveniDelavecSBLocal#returnZdravstveniDelavecs()
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<ZdravstveniDelavec> returnZdravstveniDelavecs() {
			
		return em.createNamedQuery("ZdravstveniDelavec.findAll").getResultList();
	}
	/*
	 * (non-Javadoc)
	 * @see si.fri.tpo.vmesnikiSB.ZdravstveniDelavecSBLocal#updateZdravstveniDelavec(si.fri.tpo.entitete.ZdravstveniDelavec)
	 */
	@Override
	public void updateZdravstveniDelavec(ZdravstveniDelavec zdravstveniDelavec) {
		em.merge(zdravstveniDelavec);
		
	}
	/*
	 * (non-Javadoc)
	 * @see si.fri.tpo.vmesnikiSB.ZdravstveniDelavecSBLocal#createZdravstveniDelavec(si.fri.tpo.entitete.ZdravstveniDelavec)
	 */
	@Override
	public void createZdravstveniDelavec(ZdravstveniDelavec zdravstveniDelavec) {
		em.persist(zdravstveniDelavec);
		
	}

	@Remove
	public void odstraniZrno() {
		
		
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<ZdravstveniDelavec> returnPatronazneSestre(int id) {

		return em.createNamedQuery("ZdravstveniDelavec.findByOkolis").setParameter("id", id).getResultList();
		
	}

	@Override
	public ZdravstveniDelavec patronaznaSluzbaById(int izvajalec) {

		return (ZdravstveniDelavec) em.createNamedQuery("ZdravstveniDelavec.findPatronaznaSluzba").setParameter("id", izvajalec).getSingleResult();
	}
	
	/*
	 * (non-Javadoc)
	 * @see si.fri.tpo.vmesnikiSB.ZdravstveniDelavecSBLocal#returnPatronazneSestrePoIzv(int)
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<ZdravstveniDelavec> returnPatronazneSestrePoIzv(int id) {
		return  em.createNamedQuery("ZdravstveniDelavec.findByIzv").setParameter("id", id).getResultList();
		
	}
	/*
	 * (non-Javadoc)
	 * @see si.fri.tpo.vmesnikiSB.ZdravstveniDelavecSBLocal#najdiPravega(int)
	 */

	@Override
	public ZdravstveniDelavec najdiPravega(int id) {
		return (ZdravstveniDelavec) em.createNamedQuery("ZdravstveniDelavec.findPravi").setParameter("id", id).getSingleResult();
	}

}
