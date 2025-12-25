package just.inventory.backend.controller;

import just.inventory.backend.model.Unit;
import just.inventory.backend.service.UnitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

@RestController
@RequestMapping("/api/units")
@RequiredArgsConstructor
@Tag(name = "Unit Management", description = "APIs for managing measurement units")
public class UnitController {

    private final UnitService unitService;

    @GetMapping
    @Operation(summary = "Get all units")
    public ResponseEntity<List<Unit>> getAllUnits() {
        List<Unit> units = unitService.getAllUnits();
        return ResponseEntity.ok(units);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get unit by ID")
    public ResponseEntity<Unit> getUnitById(@PathVariable Long id) {
        return unitService.getUnitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create a new unit")
    public ResponseEntity<Unit> createUnit(@RequestBody Unit unit) {
        Unit created = unitService.createUnit(unit);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a unit")
    public ResponseEntity<Unit> updateUnit(@PathVariable Long id, @RequestBody Unit unitDetails) {
        return unitService.updateUnit(id, unitDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a unit")
    public ResponseEntity<Void> deleteUnit(@PathVariable Long id) {
        if (unitService.deleteUnit(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
