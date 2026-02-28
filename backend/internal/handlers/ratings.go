package handlers

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/spartanjax/out-of-10/backend/internal/database"
	"github.com/spartanjax/out-of-10/backend/internal/models"
)

func CreateRating(c *gin.Context) {
	var req models.CreateRatingRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ratedDate, err := time.Parse("2006-01-02", req.RatedDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format, use YYYY-MM-DD"})
		return
	}

	userID := c.GetString("user_id")

	_, err = database.Pool.Exec(context.Background(),
		`INSERT INTO ratings (user_id, category_id, score, rated_date)
		 VALUES ($1, $2, $3, $4)
		 ON CONFLICT (user_id, category_id, rated_date) DO UPDATE SET score = EXCLUDED.score`,
		userID, req.CategoryID, req.Score, ratedDate,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save rating"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"status": "ok"})
}

func GetRatings(c *gin.Context) {
	userID := c.GetString("user_id")
	categoryID := c.Query("category_id")

	days, err := strconv.Atoi(c.DefaultQuery("days", "7"))
	if err != nil || days <= 0 {
		days = 7
	}

	cutoff := time.Now().AddDate(0, 0, -days).Format("2006-01-02")

	rows, err := database.Pool.Query(context.Background(),
		`SELECT rated_date::text, score
		 FROM ratings
		 WHERE user_id = $1 AND category_id = $2 AND rated_date >= $3
		 ORDER BY rated_date ASC`,
		userID, categoryID, cutoff,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch ratings"})
		return
	}
	defer rows.Close()

	ratings := []models.RatingRecord{}
	for rows.Next() {
		var r models.RatingRecord
		if err := rows.Scan(&r.RatedDate, &r.Score); err != nil {
			continue
		}
		ratings = append(ratings, r)
	}

	c.JSON(http.StatusOK, ratings)
}
