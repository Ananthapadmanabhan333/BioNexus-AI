from database import SessionLocal, engine, Base
from models.domain import Drug, GenomicDataset, Variant, Organization, User
import uuid
import datetime

def seed():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Drug).count() > 0:
            print("Database already seeded.")
            return

        print("Seeding database...")

        # 1. Add some Drugs
        drugs_data = [
            {
                "name": "Remdesivir",
                "brand_names": ["Veklury"],
                "cas_number": "1809249-37-3",
                "molecular_weight": 602.58,
                "chemical_formula": "C27H35N6O8P",
                "smiles": "CCC(CC)COC(=O)[C@H](C)NP(=O)(OC[C@H]1O[C@@](C#N)([C@H](O)[C@@H]1O)C2=CC=C3N2N=CN=C3N)OC4=CC=CC=C4",
                "drugbank_id": "DB14761",
                "pubchem_id": "121304016",
                "description": "Broad-spectrum antiviral medication.",
                "indication": "COVID-19 treatment."
            },
            {
                "name": "Metformin",
                "brand_names": ["Glucophage", "Fortamet"],
                "cas_number": "657-24-9",
                "molecular_weight": 129.16,
                "chemical_formula": "C4H11N5",
                "smiles": "CN(C)C(=N)NC(=N)N",
                "drugbank_id": "DB00331",
                "pubchem_id": "4091",
                "description": "First-line medication for the treatment of type 2 diabetes.",
                "indication": "Type 2 diabetes mellitus."
            },
            {
                "name": "Ivermectin",
                "brand_names": ["Stromectol"],
                "cas_number": "70288-86-7",
                "molecular_weight": 875.1,
                "chemical_formula": "C48H74O14",
                "smiles": "CC[C@H](C)[C@@H]1[C@H](C)[C@@H](O[C@H]2O[C@@H](C)[C@H](O)[C@@H](O[C@H]3O[C@@H](C)[C@H](O)[C@@H]3OC)C2O)C[C@@]4(O1)O[C@@H]5[C@@H](O)C(C)=C[C@H]6[C@@H]5[C@]7(O)C[C@@H](OC)[C@H]8OC(=O)[C@@H]7[C@@]6(C)C=C[C@H]8C",
                "drugbank_id": "DB00602",
                "pubchem_id": "6321424",
                "description": "Antiparasitic medication.",
                "indication": "Onchocerciasis, strongyloidiasis."
            }
        ]

        for d in drugs_data:
            drug = Drug(**d)
            db.add(drug)

        # 2. Add some Genomic Datasets
        ds1 = GenomicDataset(
            title="COVID-19 Viral Variants India-2024",
            source="GISAID",
            organism="SARS-CoV-2",
            raw_data_url="https://gisaid.org/records/cov-india-24",
            processed_json={"variant_count": 120, "sequencing_platform": "Illumina NovaSeq"}
        )
        db.add(ds1)
        db.flush() # Get ID

        # 3. Add some Variants for that dataset
        variants_data = [
            {"chromosome": "S", "position": 23403, "reference": "A", "alternate": "G", "gene_target": "Spike", "clinical_significance": "Pathogenic (D614G)"},
            {"chromosome": "S", "position": 22917, "reference": "T", "alternate": "G", "gene_target": "Spike", "clinical_significance": "VOC (L452R)"},
            {"chromosome": "ORF1ab", "position": 14408, "reference": "C", "alternate": "T", "gene_target": "RdRp", "clinical_significance": "Neutral"},
            {"chromosome": "N", "position": 28881, "reference": "GGG", "alternate": "AAC", "gene_target": "Nucleocapsid", "clinical_significance": "Pathogenic"}
        ]

        for v in variants_data:
            variant = Variant(dataset_id=ds1.id, **v)
            db.add(variant)

        db.commit()
        print("Database seeded successfully.")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
