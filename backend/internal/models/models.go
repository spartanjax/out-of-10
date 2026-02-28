package models

type AuthRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type UserInfo struct {
	ID    string `json:"id"`
	Email string `json:"email"`
}

type AuthResponse struct {
	Token string   `json:"token"`
	User  UserInfo `json:"user"`
}

type CreateRatingRequest struct {
	CategoryID string `json:"category_id" binding:"required"`
	Score      int    `json:"score" binding:"required,min=1,max=10"`
	RatedDate  string `json:"rated_date" binding:"required"`
}

type RatingRecord struct {
	RatedDate string `json:"rated_date"`
	Score     int    `json:"score"`
}
