import recommendationRepository from "../repositories/recommendation.repository.js";

const WEIGHTS = {
  skinType: 5,
  concern: 10,
  country: 2,
  productType: 3,
};

function toIdSet(value) {
  if (!Array.isArray(value)) {
    return new Set();
  }

  return new Set(value.map((item) => String(item)).filter(Boolean));
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean))];
}

class RecommendationService {
  async getRecommendations(payload = {}) {
    const selectedSkinTypes = toIdSet(payload.skinTypes);
    const selectedConcerns = toIdSet(payload.concerns);
    const selectedCountries = toIdSet(payload.countries);
    const selectedProductTypes = toIdSet(payload.productTypes);

    const products = await recommendationRepository.getProductsWithRelations();

    return products
      .map((product) => {
        let score = 0;
        const matchedAttributes = {
          skinTypes: [],
          concerns: [],
          countries: [],
          productTypes: [],
        };

        if (product.countryId && selectedCountries.has(product.countryId)) {
          score += WEIGHTS.country;
          matchedAttributes.countries.push(product.country?.namaNegara || null);
        }

        if (
          product.productTypeId &&
          selectedProductTypes.has(product.productTypeId)
        ) {
          score += WEIGHTS.productType;
          matchedAttributes.productTypes.push(
            product.productType?.nama || null,
          );
        }

        for (const relation of product.skinTypes || []) {
          if (
            relation.skinTypeId &&
            selectedSkinTypes.has(relation.skinTypeId)
          ) {
            score += WEIGHTS.skinType;
            matchedAttributes.skinTypes.push(relation.skinType?.nama || null);
          }
        }

        for (const relation of product.concerns || []) {
          if (relation.concernId && selectedConcerns.has(relation.concernId)) {
            score += WEIGHTS.concern;
            matchedAttributes.concerns.push(relation.concern?.nama || null);
          }
        }

        return {
          ...product,
          score,
          matchedAttributes: {
            skinTypes: uniqueStrings(matchedAttributes.skinTypes),
            concerns: uniqueStrings(matchedAttributes.concerns),
            countries: uniqueStrings(matchedAttributes.countries),
            productTypes: uniqueStrings(matchedAttributes.productTypes),
          },
        };
      })
      .filter((product) => product.score > 0)
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score;
        }

        const leftDate = left.createdAt
          ? new Date(left.createdAt).getTime()
          : 0;
        const rightDate = right.createdAt
          ? new Date(right.createdAt).getTime()
          : 0;

        return rightDate - leftDate;
      });
  }
}

export default new RecommendationService();
