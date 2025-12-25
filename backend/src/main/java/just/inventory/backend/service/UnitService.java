package just.inventory.backend.service;

import just.inventory.backend.model.Unit;
import just.inventory.backend.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UnitService {

    private final UnitRepository unitRepository;

    public List<Unit> getAllUnits() {
        return unitRepository.findAll();
    }

    public Optional<Unit> getUnitById(Long id) {
        return unitRepository.findById(id);
    }

    @Transactional
    public Unit createUnit(Unit unit) {
        return unitRepository.save(unit);
    }

    @Transactional
    public Optional<Unit> updateUnit(Long id, Unit unitDetails) {
        return unitRepository.findById(id)
                .map(unit -> {
                    unit.setName(unitDetails.getName());
                    unit.setDescription(unitDetails.getDescription());
                    return unitRepository.save(unit);
                });
    }

    @Transactional
    public boolean deleteUnit(Long id) {
        return unitRepository.findById(id)
                .map(unit -> {
                    unitRepository.delete(unit);
                    return true;
                })
                .orElse(false);
    }
}
